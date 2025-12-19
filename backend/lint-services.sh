#!/bin/bash

# ESLint Script for MediConnect Backend
# This script lints all services or a specific service

set -e

SERVICES_DIR="services"
SERVICES=(
  "auth-service"
  "patient-service"
  "doctor-service"
  "appointment-service"
  "notes-service"
  "api-gateway"
)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to lint a single service
lint_service() {
  local service=$1
  local fix_mode=$2

  echo -e "${BLUE}Linting ${service}...${NC}"
  cd "${SERVICES_DIR}/${service}"

  if [ "$fix_mode" = "fix" ]; then
    npm run lint:fix
  else
    npm run lint
  fi

  local exit_code=$?
  cd - > /dev/null

  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✓ ${service} passed${NC}"
  else
    echo -e "${RED}✗ ${service} has linting errors${NC}"
  fi
  echo ""

  return $exit_code
}

# Function to lint all services
lint_all() {
  local fix_mode=$1
  local has_errors=0

  echo -e "${BLUE}=== Linting all services ===${NC}"
  echo ""

  for service in "${SERVICES[@]}"; do
    if ! lint_service "$service" "$fix_mode"; then
      has_errors=1
    fi
  done

  if [ $has_errors -eq 0 ]; then
    echo -e "${GREEN}=== All services passed linting ===${NC}"
  else
    echo -e "${RED}=== Some services have linting errors ===${NC}"
    exit 1
  fi
}

# Function to lint global files
lint_global() {
  local fix_mode=$1

  echo -e "${BLUE}Linting global backend files...${NC}"

  if [ "$fix_mode" = "fix" ]; then
    npm run lint
  else
    npm run lint:check
  fi

  local exit_code=$?

  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✓ Global files passed${NC}"
  else
    echo -e "${RED}✗ Global files have linting errors${NC}"
  fi
  echo ""

  return $exit_code
}

# Main script logic
case "${1:-all}" in
  all)
    lint_all "$2"
    ;;
  global)
    lint_global "$2"
    ;;
  auth-service|patient-service|doctor-service|appointment-service|notes-service|api-gateway)
    lint_service "$1" "$2"
    ;;
  *)
    echo -e "${YELLOW}Usage: $0 [all|global|service-name] [fix]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0                          # Lint all services (check only)"
    echo "  $0 all                      # Lint all services (check only)"
    echo "  $0 all fix                  # Lint and auto-fix all services"
    echo "  $0 global                   # Lint global backend files"
    echo "  $0 auth-service             # Lint auth-service only"
    echo "  $0 auth-service fix         # Lint and fix auth-service"
    echo ""
    echo "Available services:"
    for service in "${SERVICES[@]}"; do
      echo "  - $service"
    done
    exit 1
    ;;
esac
