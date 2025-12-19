#!/bin/bash

# Combined Format & Lint Script for MediConnect Backend
# This script formats and lints all services or a specific service

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

# Function to format and lint a single service
check_service() {
  local service=$1
  local fix_mode=$2

  echo -e "${BLUE}=== Processing ${service} ===${NC}"
  cd "${SERVICES_DIR}/${service}"

  # Format
  echo -e "${BLUE}Formatting...${NC}"
  if [ "$fix_mode" = "check" ]; then
    npm run format:check
  else
    npm run format
  fi

  # Lint
  echo -e "${BLUE}Linting...${NC}"
  if [ "$fix_mode" = "check" ]; then
    npm run lint
  else
    npm run lint:fix
  fi

  local exit_code=$?
  cd - > /dev/null

  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}✓ ${service} passed${NC}"
  else
    echo -e "${RED}✗ ${service} has errors${NC}"
  fi
  echo ""

  return $exit_code
}

# Function to process all services
check_all() {
  local fix_mode=$1
  local has_errors=0

  echo -e "${BLUE}=== Checking all services ===${NC}"
  echo ""

  for service in "${SERVICES[@]}"; do
    if ! check_service "$service" "$fix_mode"; then
      has_errors=1
    fi
  done

  if [ $has_errors -eq 0 ]; then
    echo -e "${GREEN}=== All services passed ===${NC}"
  else
    echo -e "${RED}=== Some services have errors ===${NC}"
    exit 1
  fi
}

# Main script logic
case "${1:-all}" in
  all)
    check_all "$2"
    ;;
  auth-service|patient-service|doctor-service|appointment-service|notes-service|api-gateway)
    check_service "$1" "$2"
    ;;
  *)
    echo -e "${YELLOW}Usage: $0 [all|service-name] [check]${NC}"
    echo ""
    echo "This script formats (Prettier) and lints (ESLint) code."
    echo ""
    echo "Examples:"
    echo "  $0                          # Format and lint all services (with auto-fix)"
    echo "  $0 all                      # Format and lint all services (with auto-fix)"
    echo "  $0 all check                # Check formatting and linting (no auto-fix)"
    echo "  $0 auth-service             # Format and lint auth-service only"
    echo "  $0 auth-service check       # Check auth-service only"
    echo ""
    echo "Available services:"
    for service in "${SERVICES[@]}"; do
      echo "  - $service"
    done
    exit 1
    ;;
esac
