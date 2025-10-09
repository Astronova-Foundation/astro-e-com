'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryWithCount, ProductFilters } from '@/types'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  categories: CategoryWithCount[]
  className?: string
  basePath?: string
}

export function FilterSidebar({ categories, className, basePath = '/products' }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Filter state
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    brand: searchParams.get('brand') || '',
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined
  })

  // Local price range input (not instantly applied)
  const [tempMinPrice, setTempMinPrice] = useState(filters.minPrice || '')
  const [tempMaxPrice, setTempMaxPrice] = useState(filters.maxPrice || '')

  // Update URL when filters change
  const updateURL = (newFilters: ProductFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.set(key, value.toString())
      }
    })
    const queryString = params.toString()
    const newURL = queryString ? `${basePath}?${queryString}` : basePath
    router.push(newURL)
  }

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Apply button handler for price
  const applyPriceRange = () => {
    const newFilters = {
      ...filters,
      minPrice: tempMinPrice ? Number(tempMinPrice) : undefined,
      maxPrice: tempMaxPrice ? Number(tempMaxPrice) : undefined
    }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: ProductFilters = { sort: 'createdAt', order: 'desc' }
    setFilters(clearedFilters)
    setTempMinPrice('')
    setTempMaxPrice('')
    router.push(basePath)
  }

  const activeFiltersCount = Object.values(filters).filter(
    value =>
      value !== undefined &&
      value !== '' &&
      value !== null &&
      !(typeof value === 'string' && (value === 'createdAt' || value === 'desc'))
  ).length

  const FilterContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.category || 'all'}
            onValueChange={value => handleFilterChange('category', value === 'all' ? undefined : value)}
          >
            <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.slug}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range (Input fields with Apply button) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range (NPR)</label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Min"
              value={tempMinPrice}
              onChange={e => setTempMinPrice(e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={tempMaxPrice}
              onChange={e => setTempMaxPrice(e.target.value)}
              className="w-1/2"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={applyPriceRange}
            className="mt-2 w-full"
          >
            Apply Price Range
          </Button>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Input
            placeholder="Enter brand name..."
            value={filters.brand}
            onChange={e => handleFilterChange('brand', e.target.value)}
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Rating</label>
          <Select
            value={filters.rating?.toString() || '0'}
            onValueChange={value =>
              handleFilterChange('rating', value !== '0' ? Number(value) : undefined)
            }
          >
            <SelectTrigger><SelectValue placeholder="Any rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Availability</label>
          <Select
            value={filters.inStock === undefined ? 'all' : 'inStock'}
            onValueChange={value => handleFilterChange('inStock', value === 'inStock' ? true : undefined)}
          >
            <SelectTrigger><SelectValue placeholder="All products" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="inStock">In stock only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Featured</label>
          <Select
            value={filters.isFeatured === undefined ? 'all' : 'featured'}
            onValueChange={value => handleFilterChange('isFeatured', value === 'featured' ? true : undefined)}
          >
            <SelectTrigger><SelectValue placeholder="All products" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              <SelectItem value="featured">Featured only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={`${filters.sort || 'createdAt'}-${filters.order || 'desc'}`}
            onValueChange={value => {
              const [sort, order] = value.split('-')
              handleFilterChange('sort', sort)
              handleFilterChange('order', order)
            }}
          >
            <SelectTrigger><SelectValue placeholder="Sort by..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price Low to High</SelectItem>
              <SelectItem value="price-desc">Price High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <div className="mt-6 sticky bottom-0 bg-background border-t pt-3">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="w-full justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-scroll">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <div className="mt-6"><FilterContent /></div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="sticky top-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex gap-3 items-center">
              <Filter className="w-5 h-5 text-astro-primary" /> Filters
            </h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>
    </div>
  )
}
