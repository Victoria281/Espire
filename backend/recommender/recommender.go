package recommender

import (
	"math"
	"sort"

	"github.com/Victoria281/Espire/backend/models"
	"github.com/timkaye11/goRecommend/ALS"
)

// Calculate cosine similarity between two vectors
func CosineSimilarity(v1, v2 []float64) float64 {
	dotProduct := 0.0
	m1 := 0.0
	m2 := 0.0
	for i := 0; i < len(v1); i++ {
		dotProduct += v1[i] * v2[i]
		m1 += v1[i] * v2[i]
		m2 += v2[i] * v2[i]
	}
	if m1 == 0 || m2 == 0 {
		return 0.0
	}
	return dotProduct / (math.Sqrt(m1) * math.Sqrt(m2))
}

// // GetRecommendations provides a list of recommended articles for a user
// // based on their tags and previous interactions with other articles.
// func GetRecommendations(userTags string, username string, articles []Article, interactions [][]int) []Article {
// 	fmt.Println("Start function...")

// 	// Taking all teh tags
// 	fmt.Println("TAGS")
// 	fmt.Printf(tags)
// 	tags := make([]string, len(articles))
// 	for i, article := range articles {
// 		tags[i] = article.Tags
// 		fmt.Printf(tags[i])
// 	}

// 	// TF-IDF Vectorizer -> turn tags to vectors
// 	vectorizer := teacup.NewTfidfVectorizer()
// 	fmt.Println(vectorizer)
// 	tagVector := vectorizer.FitTransform(tags)
// 	fmt.Println("VECTORS")
// 	for i, vec := range tagVector {
// 		fmt.Printf("tag %d vector: %v\n", i, vec)
// 	}

// 	fmt.Println("Do on user tag")
// 	userVector := vectorizer.Transform([]string{userTags})
// 	fmt.Printf(userVector)

// 	fmt.Println("Calculating similarity scores between user adn all")
// 	scores := teacup.CosineSimilarity(userVector, tagVector).Flatten()
// 	fmt.Println("=======Answers=======")
// 	for i, score := range scores {
// 		fmt.Printf("tag %d score: %.4f\n", i, score)
// 	}

// 	// Creating matrix
// 	fmt.Println("matrix")
// 	matrix := teacup.NewSparseMatrix(len(interactions), len(interactions[0]))
// 	for i, row := range interactions {
// 		for j, value := range row {
// 			matrix.Set(i, j, float64(value))
// 			fmt.Printf("Interaction matrix[%d][%d] = %.2f\n", i, j, float64(value))
// 		}
// 	}

// 	fmt.Println(matrix)

// 	// ALS Model
// 	model := implicit.NewAlternatingLeastSquares()
// 	fmt.Println("=======Answers=======")
// 	model.Fit(matrix)
// 	fmt.Println("training complete")

// 	fmt.Println("Generate recommendations for ", userID)
// 	// Get top 3 article recommendations for the user.
// 	recommendations := model.Recommend(userID, matrix, 3)
// 	fmt.Println("DONEEEEE")
// 	for _, recommendation := range recommendations {
// 		fmt.Printf("Recommended Article ID: %d, Score: %.4f\n", recommendation.Item, recommendation.Score)
// 	}

// 	// Hybrid by combining similarity score and reccomendation score - 50% weight
// 	combinedScores := make([]float64, len(articles))
// 	fmt.Println("combinedScores")
// 	fmt.Println(combinedScores)

// 	for i, score := range scores {
// 		combinedScores[i] = score * 0.5
// 		fmt.Printf("Article %d: %.4f\n", i, combinedScores[i])
// 	}

// 	fmt.Println("combining")

// 	for _, recommendation := range recommendations {
// 		articleID := recommendation.Item
// 		score := recommendation.Score
// 		combinedScores[articleID] += score * 0.5
// 		fmt.Printf("combinedScores for Article %d: %.4f\n", articleID, combinedScores[articleID])
// 	}

// 	fmt.Println("final")
// 	for i, score := range combinedScores {
// 		fmt.Printf("Article %d score: %.4f\n", i, score)
// 	}

// 	// Sorting
// 	fmt.Println("sorting")
// 	sortedIndices := teacup.Sort(combinedScores, teacup.Descending)
// 	for i, index := range sortedIndices {
// 		fmt.Printf("Rank %d: Article %d\n", i+1, index)
// 	}

// 	// final recommended articles.
// 	recommendedArticles := []Article{}
// 	for _, index := range sortedIndices {
// 		recommendedArticles = append(recommendedArticles, articles[index])
// 		fmt.Printf("Adding Article %d to recommendations.\n", index)
// 	}
// 	fmt.Println(recommendedArticles)

// 	return recommendedArticles
// }

// HybridRecommendations -> use ALS + cosine similarity
// GetHybridRecommendations calculates recommendations using both ALS and cosine similarity
func GetHybridRecommendations(uid uint, userTags []string, interactions []models.UserArticleVisit, articles []models.Articles) []models.Articles {
	userIndex, err := getUserIndex(uid)
	if err != nil {
		return nil
	}

	userArticleMatrix, articleIDMap := createUserArticleMatrix(interactions, articles)
	ratings := flattenInteractions(userArticleMatrix)
	matrix := ALS.MakeRatingMatrix(ratings, len(userArticleMatrix), len(userArticleMatrix[0]))

	Q := ALS.TrainImplicit(matrix, 10, 20, 0.01)

	recommendations := make([]struct {
		ID    int
		Score float64
	}, len(articles))

	for i, article := range articles {
		prediction, _ := ALS.Predict(Q, userIndex, articleIDMap[article.ID])
		recommendations[i] = struct {
			ID    int
			Score float64
		}{ID: int(article.ID), Score: prediction}
	}

	sort.Slice(recommendations, func(i, j int) bool {
		return recommendations[i].Score > recommendations[j].Score
	})
	topArticles := make([]models.Articles, len(recommendations))
	for i, rec := range recommendations {
		topArticles[i] = articles[rec.ID]
	}

	return topArticles
}

func getUserIndex(uid uint) (int, error) {
	return int(uid), nil
}

func createUserArticleMatrix(interactions []models.UserArticleVisit, articles []models.Articles) ([][]float64, map[uint]int) {
	userArticleMap := make(map[string]map[uint]float64)
	articleIDMap := make(map[uint]int)
	for i, article := range articles {
		articleIDMap[article.ID] = i
	}
	for _, interaction := range interactions {
		if _, exists := userArticleMap[interaction.Username]; !exists {
			userArticleMap[interaction.Username] = make(map[uint]float64)
		}
		userArticleMap[interaction.Username][interaction.ArticleID] = 1.0 // Assuming a binary interaction for simplicity
	}
	numUsers := len(userArticleMap)
	numArticles := len(articles)
	matrix := make([][]float64, numUsers)
	userIndex := 0
	for _, articleMap := range userArticleMap {
		matrix[userIndex] = make([]float64, numArticles)
		for articleID, rating := range articleMap {
			matrix[userIndex][articleIDMap[articleID]] = rating
		}
		userIndex++
	}
	return matrix, articleIDMap
}

func flattenInteractions(interactions [][]float64) []float64 {
	var ratings []float64
	for _, row := range interactions {
		ratings = append(ratings, row...)
	}
	return ratings
}
