package auth

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(username, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": username,
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}

	fmt.Println(tokenString)
	return tokenString, nil
}

func ParseUsername(c *fiber.Ctx) string {

	tokenString := c.Get("Authorization")
	tokenString = strings.Replace(tokenString, "Bearer ", "", 1)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Error when parsing jwt"})
		return ""
	}

	if !token.Valid {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid JWT token"})
		return ""
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid JWT token claims"})
		return ""
	}

	username, ok := claims["username"].(string)
	if !ok {
		c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Username not found from JWT token"})
		return ""
	}

	return username
}
