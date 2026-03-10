/**
 * Backend Filter Parsing and Application
 * 
 * Examples of how different frameworks and ORMs handle filter parsing
 * and application to database queries.
 */

// ============================================================================
// Express + Knex.js (JavaScript)
// ============================================================================

import type { QueryBuilder } from "knex"

export function parseExpressFilters(req: any): Record<string, any> {
  const query = req.query
  const filters: Record<string, any> = {}

  // Handle bracket notation: ?filter[status][eq]=active
  if (query.filter && typeof query.filter === "object") {
    return query.filter
  }

  // Handle Django-style: ?status__eq=active&age__gte=18
  for (const [key, value] of Object.entries(query)) {
    if (key.includes("__")) {
      const [field, op] = key.split("__")
      if (!filters[field]) filters[field] = {}
      filters[field][op] = value
    } else {
      filters[key] = { eq: value }
    }
  }

  return filters
}

export function applyKnexFilters(
  query: QueryBuilder,
  filters: Record<string, Record<string, any>>,
  schema: Record<string, { field: string; operators: string[] }>
): QueryBuilder {
  for (const [filterName, operators] of Object.entries(filters)) {
    const def = schema[filterName]
    if (!def) continue

    for (const [op, value] of Object.entries(operators)) {
      if (!def.operators.includes(op)) continue

      switch (op) {
        case "eq":
          query = query.where(def.field, "=", value)
          break
        case "ne":
          query = query.where(def.field, "!=", value)
          break
        case "gt":
          query = query.where(def.field, ">", value)
          break
        case "gte":
          query = query.where(def.field, ">=", value)
          break
        case "lt":
          query = query.where(def.field, "<", value)
          break
        case "lte":
          query = query.where(def.field, "<=", value)
          break
        case "in":
          const inValues = Array.isArray(value) ? value : value.split(",")
          query = query.whereIn(def.field, inValues)
          break
        case "nin":
          const ninValues = Array.isArray(value) ? value : value.split(",")
          query = query.whereNotIn(def.field, ninValues)
          break
        case "like":
          query = query.where(def.field, "like", `%${value}%`)
          break
        case "ilike":
          query = query.where(def.field, "ilike", `%${value}%`)
          break
      }
    }
  }

  return query
}

// ============================================================================
// FastAPI + SQLAlchemy (Python)
// ============================================================================

/*
from fastapi import FastAPI, Query
from sqlalchemy import Column, String, Integer
from typing import Optional, Dict, Any

app = FastAPI()

def parse_filters(filters: Optional[str] = Query(None)) -> Dict[str, Dict[str, Any]]:
    """Parse filter from query string"""
    if not filters:
        return {}
    
    # Parse Django-style: status__eq=active&age__gte=18
    result = {}
    for param, value in dict(Query(...)).items():
        if '__' in param:
            field, op = param.split('__', 1)
            if field not in result:
                result[field] = {}
            result[field][op] = value
    return result

def apply_sqlalchemy_filters(query, filters: Dict[str, Dict[str, Any]], schema: Dict[str, Any]):
    """Apply filters to SQLAlchemy query"""
    for field_name, operators in filters.items():
        field_def = schema.get(field_name)
        if not field_def:
            continue
        
        field = getattr(Model, field_def['field'])
        
        for op, value in operators.items():
            if op not in field_def.get('operators', []):
                continue
            
            if op == 'eq':
                query = query.filter(field == value)
            elif op == 'ne':
                query = query.filter(field != value)
            elif op == 'gt':
                query = query.filter(field > value)
            elif op == 'gte':
                query = query.filter(field >= value)
            elif op == 'lt':
                query = query.filter(field < value)
            elif op == 'lte':
                query = query.filter(field <= value)
            elif op == 'in':
                values = value.split(',') if isinstance(value, str) else value
                query = query.filter(field.in_(values))
            elif op == 'like':
                query = query.filter(field.like(f'%{value}%'))
            elif op == 'ilike':
                query = query.filter(field.ilike(f'%{value}%'))
    
    return query
*/

// ============================================================================
// Rails + ActiveRecord (Ruby)
// ============================================================================

/*
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def index
    @users = apply_filters(User.all, filter_params)
    render json: @users
  end

  private

  def filter_params
    # Handle Django-style: status__eq=active&age__gte=18
    params.to_h.select { |k, v| k.include?('__') }
  end

  def apply_filters(relation, filters)
    filters.each do |param, value|
      field, op = param.split('__')
      
      case op
      when 'eq'
        relation = relation.where(field: value)
      when 'ne'
        relation = relation.where.not(field: value)
      when 'gt'
        relation = relation.where("#{field} > ?", value)
      when 'gte'
        relation = relation.where("#{field} >= ?", value)
      when 'lt'
        relation = relation.where("#{field} < ?", value)
      when 'lte'
        relation = relation.where("#{field} <= ?", value)
      when 'in'
        relation = relation.where(field => value.split(','))
      when 'like'
        relation = relation.where("#{field} LIKE ?", "%#{value}%")
      when 'ilike'
        relation = relation.where("#{field} ILIKE ?", "%#{value}%")
      end
    end
    
    relation
  end
end
*/

// ============================================================================
// Django ORM (Python)
// ============================================================================

/*
# Most native support for Django-style filtering (__lookup)
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def users_list(request):
    # Django automatically parses __lookups: status__eq=active&age__gte=18
    filters = {}
    
    for key, value in request.query_params.items():
        filter_key = key.replace('__', '__')  # Already in right format
        if key.startswith('filter_'):
            field = key.replace('filter_', '')
            filters[field + '__exact'] = value
        else:
            # Map custom names to actual fields
            if not is_allowed_filter(field):
                continue
            filters[field] = value
    
    users = User.objects.filter(**filters)
    return Response(UserSerializer(users, many=True).data)

def is_allowed_filter(field):
    """Whitelist allowed filterable fields"""
    ALLOWED_FILTERS = {
        'status': 'status',
        'email': 'email',
        'name': 'profile__display_name',
        # Not allowing: password, internalId, etc.
    }
    return field in ALLOWED_FILTERS
*/

// ============================================================================
// Using qs library for consistent parsing (All frameworks)
// ============================================================================

/*
import qs from 'qs'

// In any JavaScript framework
function handleFilteredRequest(queryString) {
  const parsed = qs.parse(queryString)
  // qs intelligently handles various formats:
  // - Bracket notation: filter[status][eq]=active
  // - Comma-separated: filter=status:eq:active,age:gte:18
  // - Nested objects: filter.status.eq=active
  
  const filters = parsed.filter || {}
  return applyFilters(filters)
}
*/

// ============================================================================
// GraphQL Alternative (Query-based filtering)
// ============================================================================

/*
# Instead of query strings, GraphQL uses structured queries:

query {
  users(
    filters: {
      status: { eq: "active" }
      age: { gte: 18 }
      name: { ilike: "john" }
    }
    sort: [{ field: "createdAt", direction: "desc" }]
    limit: 10
  ) {
    id
    name
    email
  }
}

# Backend resolver handles structured filters directly:
def resolve_users(obj, info, filters=None, sort=None, limit=10):
  query = User.objects.all()
  
  if filters:
    for field_name, operators in filters.items():
      field_def = FILTER_SCHEMA.get(field_name)
      if not field_def:
        continue
      
      for op, value in operators.items():
        # Apply filter based on operator
        query = apply_operator(query, field_def['field'], op, value)
  
  return query[:limit]
*/

// ============================================================================
// Security Considerations
// ============================================================================

export function validateFilterSchema(
  filters: Record<string, any>,
  allowedFilters: Set<string>
): boolean {
  for (const filterName of Object.keys(filters)) {
    if (!allowedFilters.has(filterName)) {
      console.warn(`Attempted to filter by unauthorized field: ${filterName}`)
      return false
    }
  }
  return true
}

export function sanitizeFilterValue(value: any, type: string): any {
  switch (type) {
    case "string":
      return String(value).slice(0, 255) // Limit length
    case "number":
      return Number(value)
    case "boolean":
      return value === "true" || value === true
    case "date":
      // Validate ISO date format
      const date = new Date(String(value))
      return isNaN(date.getTime()) ? null : date
    default:
      return value
  }
}

// Usage in request handler:
function safeApplyFilters(filters: any, schema: any) {
  const allowedFields = new Set(Object.keys(schema))

  if (!validateFilterSchema(filters, allowedFields)) {
    throw new Error("Invalid filter fields")
  }

  const sanitized: Record<string, any> = {}
  for (const [field, operators] of Object.entries(filters)) {
    const def = schema[field]
    for (const [op, value] of Object.entries(operators)) {
      const sanitized_value = sanitizeFilterValue(value, def.type)
      sanitized[field] = { ...sanitized, [op]: sanitized_value }
    }
  }

  return sanitized
}
