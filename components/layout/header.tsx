'use client'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Moon, Rocket, SearchIcon, Sun, X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { NavigationMenu, NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { NavigationMenuItem, NavigationMenuList } from '../ui/navigation-menu'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search query:', searchQuery)
  }

  const user = session?.user

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b',
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 md:px-10">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(prev => !prev)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Rocket />
            <span className="text-primary">StartupHub</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-6">
              <NavigationMenuItem className='w-20 justify-center flex'>
                <NavigationMenuLink asChild>
                  <Link href="/startups" className="hover:text-primary transition-colors">
                    Startups
                  </Link>
                </NavigationMenuLink>

              </NavigationMenuItem>
              <NavigationMenuItem className='w-20 justify-center flex p-2'>
                <NavigationMenuLink asChild>
                  <Link href="/explore" className="hover:text-primary transition-colors">
                    Explore
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className='w-20 justify-center flex'>
                  <NavigationMenuLink asChild>
                    <Link href="/resources" className="hover:text-primary transition-colors">
                      Resources
                    </Link>
                  </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search - Desktop */}
          <form onSubmit={handleSubmit} className="hidden md:flex relative">
            <SearchIcon className="absolute left-3 top-2.5 text-gray-500" />
            <Input
              placeholder="Search..."
              className="w-84 pl-10 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                  <Image src={user.image || '/default-avatar.png'} alt="User" fill className="object-cover" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/profile/${user.username}`)}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button onClick={() => signIn('github')} className="hover:text-primary">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search + Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm z-40 p-4 space-y-3">
          <form onSubmit={handleSubmit} className="relative w-full">
            <SearchIcon className="absolute left-3 top-2.5 text-gray-500" />
            <Input
              placeholder="Search..."
              className="w-full pl-10 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <nav className="flex flex-col space-y-2">
            <Link href="/startups" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">
              Startups
            </Link>
            <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">
              Explore
            </Link>
            <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary">
              Resources
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
