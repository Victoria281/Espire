package recommender

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"gonum.org/v1/gonum/mat"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/Victoria281/Espire/backend/repo"
)

type UserArticleVisit struct {
	Username  string
	ArticleID int
	Visit     int
	CreatedAt time.Time
}

// Calculate cosine similarity
func CosineSimilarity(v1, v2 []float64) float64 {
	dotProduct := 0.0
	m1 := 0.0
	m2 := 0.0
	for i := 0; i < len(v1); i++ {
		dotProduct += v1[i] * v2[i]
		m1 += v1[i] * v1[i]
		m2 += v2[i] * v2[i]
	}
	if m1 == 0 || m2 == 0 {
		return 0.0
	}
	return dotProduct / (math.Sqrt(m1) * math.Sqrt(m2))
}

// Generate feature matrix for regression
func GenerateFeatureMatrix(userInteractions map[uint]repo.ArticleDetails, articles []models.Articles) (*mat.Dense, []float64) {
	numArticles := len(articles)
	X := mat.NewDense(numArticles, 2, nil)
	y := make([]float64, numArticles)

	now := time.Now()
	for i, article := range articles {
		var visitCount float64
		var recencyScore float64

		foundInteraction := false
		for _, interaction := range userInteractions {
			if interaction.ArticleID == article.ID {
				visitCount = float64(interaction.TotalVisitCount)
				recencyScore = float64(now.Sub(interaction.CreatedAt).Hours())
				foundInteraction = true
				break
			}
		}

		if !foundInteraction {
			recencyScore = float64(now.Sub(article.CreatedAt).Hours())
		}

		X.Set(i, 0, visitCount)
		X.Set(i, 1, recencyScore)
		y[i] = visitCount
	}

	fmt.Println("Matrix X:")
	fmt.Printf("%v\n", mat.Formatted(X, mat.Prefix(""), mat.Excerpt(0)))

	fmt.Println("Target y:")
	fmt.Println(y)

	return X, y
}

func TrainLinearRegression(X *mat.Dense, y []float64) *mat.VecDense {
	m, n := X.Dims()
	yVec := mat.NewVecDense(m, y)

	Xt := mat.NewDense(n, m, nil)
	Xt.CloneFrom(X.T())

	XtX := mat.NewDense(n, n, nil)
	XtX.Mul(Xt, X)

	lambda := 0.01
	reg := mat.NewDense(n, n, nil)
	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			if i == j {
				reg.Set(i, j, XtX.At(i, j)+lambda)
			} else {
				reg.Set(i, j, XtX.At(i, j))
			}
		}
	}

	XtY := mat.NewVecDense(n, nil)
	XtY.MulVec(Xt, yVec)

	// Compute the pseudoinverse
	var XtX_inv mat.Dense
	if err := XtX_inv.Inverse(reg); err != nil {
		panic("Matrix inversion failed: " + err.Error())
	}

	// Compute coefficients
	coefficients := mat.NewVecDense(n, nil)
	coefficients.MulVec(&XtX_inv, XtY)

	return coefficients
}

// Using the trained model to predict relevance scores for articles
func PredictRelevance(X *mat.Dense, coefficients *mat.VecDense) []float64 {
	numArticles, _ := X.Dims()
	predictions := make([]float64, numArticles)

	for i := 0; i < numArticles; i++ {
		row := X.RawRowView(i)
		rowVec := mat.NewVecDense(len(row), row)
		var score float64
		score = mat.Dot(rowVec, coefficients)
		predictions[i] = score
	}

	fmt.Println("Predictions:")
	fmt.Println(predictions)

	return predictions
}

func GetContentBasedRecommendations(username string, userTags []struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}, interactions []models.UserArticleVisit, articles []models.Articles, visitScores map[uint]int) []models.Articles {
	fmt.Println("START Get content-based recommendations")

	// converting userTags to strings
	userTagsList := make([]string, len(userTags))
	for i, tag := range userTags {
		userTagsList[i] = tag.Name
	}
	userTagsStr := strings.Join(userTagsList, " ")
	fmt.Println("Cleaned User Tags String:")
	fmt.Println(userTagsStr)

	// from articles, convert tags to the same format
	tags := make([]string, len(articles))
	for i, article := range articles {
		tagStrs := make([]string, len(article.Tags))
		for j, tag := range article.Tags {
			tagStrs[j] = tag.Name
		}
		tags[i] = strings.Join(tagStrs, " ")
	}
	// fmt.Println("tags")
	// fmt.Println(tags)

	vectorizer := NewTFIDFVectorizer()
	tfidfScores, err := vectorizer.FitTransform(tags)
	if err != nil {
		fmt.Printf("Error fitting and transforming tags: %v\n", err)
		return nil
	}

	// fmt.Println("Vocab")
	// for term, idx := range vectorizer.Vocabulary {
	// 	fmt.Printf("Term: %s, Index: %d\n", term, idx)
	// }

	userVector := vectorizer.Transform(userTagsStr)
	fmt.Println("User Vector:")
	fmt.Println(userVector)

	// get the similarity scores
	similarityScores := make([]float64, len(articles))
	for i, vec := range tfidfScores {
		similarityScores[i] = CosineSimilarity(userVector, vec)
		// fmt.Printf("Article %d Similarity Score: %.4f\n", i, similarityScores[i])
	}

	// Combine with user visits
	combinedScores := make([]struct {
		ID    int
		Score float64
	}, len(articles))
	for i, article := range articles {
		visitScore := float64(visitScores[article.ID])
		combinedScores[i] = struct {
			ID    int
			Score float64
		}{
			ID:    i,
			Score: 0.7*similarityScores[i] + 0.3*visitScore,
		}
		// fmt.Printf("Article %d Visit Score: %.4f\n", i, visitScore)
		// fmt.Printf("Article %d Combined Score: %.4f\n", i, combinedScores[i].Score)
	}

	// Sort by combined score
	sort.Slice(combinedScores, func(i, j int) bool {
		return combinedScores[i].Score > combinedScores[j].Score
	})

	// Collect top 20 recommendations
	topN := 20
	if len(combinedScores) < topN {
		topN = len(combinedScores)
	}
	topArticles := make([]models.Articles, topN)
	for i := 0; i < topN; i++ {
		rec := combinedScores[i]
		topArticles[i] = articles[rec.ID]
		// fmt.Printf("Top Article %d ID: %d, Score: %.4f\n", i+1, rec.ID, rec.Score)
	}

	fmt.Println("END Get content-based recommendations")
	return topArticles
}
