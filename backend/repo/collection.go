package repo

import (
	"fmt"
	"time"

	"errors"

	"github.com/Victoria281/Espire/backend/models"
	"gorm.io/gorm"
)

type CollectionRepository interface {
	Create(collection models.Collection) (uint, error)
	Update(collectionID uint, updatedCollection interface{}) error
	FindAll(username string) ([]models.Collection, error)
	AddArticle(collectionID uint, articleID uint) error
	RemoveArticle(collectionID uint, articleID uint) error
	Delete(collectionID uint) error
}

type collectionSqlRepository struct {
	DB *gorm.DB
}

func NewCollectionRepository(db *gorm.DB) CollectionRepository {
	return &collectionSqlRepository{DB: db}
}

func (r *collectionSqlRepository) Create(collection models.Collection) (uint, error) {
	err := r.DB.Create(&collection).Error
	return collection.ID, err
}

func (r *collectionSqlRepository) Update(collectionID uint, updatedCollection interface{}) error {
	if err := r.DB.Model(&models.Collection{}).Where("deleted_at IS NULL").Where("id = ?", collectionID).UpdateColumns(updatedCollection).Error; err != nil {
		return err
	}
	return nil
}

func (r *collectionSqlRepository) FindAll(username string) ([]models.Collection, error) {
	var collections []models.Collection
	err := r.DB.Preload("Articles").Where("username = ?", username).Where("deleted_at IS NULL").Find(&collections).Error
	return collections, err
}

func (r *collectionSqlRepository) AddArticle(collectionID uint, articleID uint) error {
	var existingEntry models.CollectionArticle
	result := r.DB.Where("collection_id = ? AND articles_id = ?", collectionID, articleID).First(&existingEntry)
	if result.Error == nil {
		return nil
	}
	if result.Error != gorm.ErrRecordNotFound {
		return result.Error
	}
	newEntry := models.CollectionArticle{
		CollectionID: collectionID,
		ArticlesID:   articleID,
	}
	return r.DB.Create(&newEntry).Error
}

func (r *collectionSqlRepository) RemoveArticle(collectionID uint, articleID uint) error {
	fmt.Println(collectionID)
	fmt.Println(articleID)
	result := r.DB.Where("collection_id = ? AND articles_id = ?", collectionID, articleID).Delete(&models.CollectionArticle{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no matching record found")
	}
	return nil
}
func (r *collectionSqlRepository) Delete(collectionID uint) error {
	if err := r.DB.Model(&models.Collection{}).Where("id = ?", collectionID).Updates(map[string]interface{}{
		"deleted_at": time.Now(),
	}).Error; err != nil {
		return err
	}

	if err := r.DB.Where("collection_id = ?", collectionID).Delete(&models.CollectionArticle{}).Error; err != nil {
		return err
	}

	return nil
}
