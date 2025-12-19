#!/bin/bash

# Prettier Format Script for MediConnect Backend
# This script formats all services or a specific service

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
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to format a single service
format_service() {
  local service=$1
  local check_only=$2

  echo -e "${BLUE}Formatting ${service}...${NC}"
  cd "${SERVICES_DIR}/${service}"
  if [ "$check_only" = "check" ]; then
    npm run format:check
  else
    npm run format
  fi

  cd - > /dev/null
  echo -e "${GREEN}✓ ${service} completed${NC}"
  echo ""
}

# Function to format all services
format_all() {
  local check_only=$1

  echo -e "${BLUE}=== Formatting all services ===${NC}"
  echo ""

  for service in "${SERVICES[@]}"; do
    format_service "$service" "$check_only"
  done

  echo -e "${GREEN}=== All services formatted successfully ===${NC}"
}

# Function to format global files
format_global() {
  local check_only=$1

  echo -e "${BLUE}Formatting global backend files...${NC}"

  if [ "$check_only" = "check" ]; then
    npm run format:check
  else
    npm run format
  fi

  echo -e "${GREEN}✓ Global files completed${NC}"
  echo ""
}

# Main script logic
case "${1:-all}" in
  all)
    format_all "$2"
    ;;
  global)
    format_global "$2"
    ;;
  auth-service|patient-service|doctor-service|appointment-service|notes-service|api-gateway)
    format_service "$1" "$2"
    ;;
  *)
    echo -e "${YELLOW}Usage: $0 [all|global|service-name] [check]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0                          # Format all services"
    echo "  $0 all                      # Format all services"
    echo "  $0 all check                # Check formatting for all services"
    echo "  $0 global                   # Format global backend files"
    echo "  $0 auth-service             # Format auth-service only"
    echo "  $0 auth-service check       # Check auth-service formatting"
    echo ""
    echo "Available services:"
    for service in "${SERVICES[@]}"; do
      echo "  - $service"
    done
    exit 1
    ;;
esac
