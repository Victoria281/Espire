package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// PrintingDebugInfo middleware logs debug information for incoming requests
func PrintingDebugInfo(c *fiber.Ctx) error {
	// Log debug information
	fmt.Println("")
	fmt.Println("------------[Debug Info Start]---------------")
	fmt.Printf("Servicing %s %s..\n", c.Method(), c.Path())
	fmt.Println("> req.params:", c.Params)
	fmt.Println("> req.body:", string(c.Body()))
	fmt.Println("------------[Debug Info End]---------------")

	// Proceed to the next middleware
	return c.Next()
}
