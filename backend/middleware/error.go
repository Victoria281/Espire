package middleware

import "errors"

// Define custom error types
var (
	ErrInvalidRequest      = errors.New("invalid request")
	ErrUnauthorized        = errors.New("unauthorized")
	ErrIncorrectPassword   = errors.New("incorrect password")
	ErrInternalServerError = errors.New("internal server error")
)
