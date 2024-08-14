package recommender

import (
	"math"
	"strings"
)

func Tokenize(text string) []string {
	return strings.Fields(text)
}

type TFIDFVectorizer struct {
	Vocabulary map[string]int
	IDF        map[string]float64
}

func NewTFIDFVectorizer() *TFIDFVectorizer {
	return &TFIDFVectorizer{
		Vocabulary: make(map[string]int),
		IDF:        make(map[string]float64),
	}
}

func (v *TFIDFVectorizer) Fit(corpus []string) {
	docCount := float64(len(corpus))
	docFreq := make(map[string]float64)

	for _, doc := range corpus {
		tokens := Tokenize(doc)
		seen := make(map[string]bool)
		for _, token := range tokens {
			if _, exists := seen[token]; !exists {
				docFreq[token]++
				seen[token] = true
			}
		}
	}

	for term, freq := range docFreq {
		v.IDF[term] = math.Log(docCount / (1 + freq))
	}
}

func (v *TFIDFVectorizer) Transform(doc string) []float64 {
	tokens := Tokenize(doc)
	vector := make([]float64, len(v.Vocabulary))

	termFreq := make(map[string]int)
	for _, token := range tokens {
		termFreq[token]++
	}

	for term, idx := range v.Vocabulary {
		tf := float64(termFreq[term]) / float64(len(tokens))
		idf, exists := v.IDF[term]
		if !exists {
			idf = 0
		}
		vector[idx] = tf * idf
	}

	return vector
}

func (v *TFIDFVectorizer) FitTransform(corpus []string) ([][]float64, error) {
	vocab := make(map[string]int)
	idx := 0
	for _, doc := range corpus {
		tokens := Tokenize(doc)
		for _, token := range tokens {
			if _, exists := vocab[token]; !exists {
				vocab[token] = idx
				idx++
			}
		}
	}
	v.Vocabulary = vocab

	v.Fit(corpus)

	vectors := make([][]float64, len(corpus))
	for i, doc := range corpus {
		vectors[i] = v.Transform(doc)
	}

	return vectors, nil
}
