# Next.js Project Structure Guide

## Overview
This is a Next.js application with TypeScript, Tailwind CSS, and ESLint. Next.js is a full-stack React framework that allows you to build both frontend and backend in the same project.

## Project Structure

```
RSSProjectSelf/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── page.tsx           # Home page (/)
│   │   ├── layout.tsx         # Root layout (applies to all pages)
│   │   ├── globals.css        # Global styles
│   │   ├── favicon.ico        # Site icon
│   │   ├── api/               # Backend API routes
│   │   │   ├── hello/
│   │   │   │   └── route.ts   # API endpoint: /api/hello
│   │   │   └── users/
│   │   │       └── route.ts   # API endpoint: /api/users
│   │   ├── about/
│   │   │   └── page.tsx       # About page (/about)
│   │   └── blog/
│   │       ├── page.tsx       # Blog listing page (/blog)
│   │       └── [slug]/
│   │           └── page.tsx   # Dynamic blog post page (/blog/post-title)
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── features/         # Feature-specific components
│   │       ├── BlogCard.tsx
│   │       └── UserProfile.tsx
│   ├── lib/                  # Utility functions and configurations
│   │   ├── utils.ts          # General utility functions
│   │   ├── db.ts             # Database configuration
│   │   └── auth.ts           # Authentication utilities
│   ├── types/                # TypeScript type definitions
│   │   ├── user.ts
│   │   └── blog.ts
│   └── styles/               # Additional styles (if needed)
│       └── components.css
├── public/                   # Static files (images, fonts, etc.)
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
└── README.md                 # This file
```

## Where to Put Your Code

### 🎨 Frontend Code

#### 1. **Pages** (`src/app/`)
- **Static pages**: Create folders with `page.tsx` files
  - `src/app/about/page.tsx` → `/about` route
  - `src/app/contact/page.tsx` → `/contact` route

- **Dynamic pages**: Use square brackets for dynamic routes
  - `src/app/blog/[slug]/page.tsx` → `/blog/any-post-title`
  - `src/app/users/[id]/page.tsx` → `/users/123`

#### 2. **Components** (`src/components/`)
- **UI Components** (`src/components/ui/`): Reusable, generic components
  ```tsx
  // src/components/ui/Button.tsx
  export function Button({ children, ...props }) {
    return <button className="btn" {...props}>{children}</button>
  }
  ```

- **Layout Components** (`src/components/layout/`): Page structure components
  ```tsx
  // src/components/layout/Header.tsx
  export function Header() {
    return <header>Navigation and branding</header>
  }
  ```

- **Feature Components** (`src/components/features/`): Business logic components
  ```tsx
  // src/components/features/BlogCard.tsx
  export function BlogCard({ post }) {
    return <div>Blog post preview</div>
  }
  ```

#### 3. **Layouts** (`src/app/layout.tsx`)
- Root layout applies to all pages
- Define global navigation, footer, and meta tags
- Import global styles here

### 🔧 Backend Code

#### 1. **API Routes** (`src/app/api/`)
- **REST API endpoints**: Create folders with `route.ts` files
  ```tsx
  // src/app/api/users/route.ts
  export async function GET() {
    // Handle GET /api/users
    return Response.json({ users: [] })
  }
  
  export async function POST(request: Request) {
    // Handle POST /api/users
    const data = await request.json()
    return Response.json({ message: 'User created' })
  }
  ```

- **Dynamic API routes**:
  ```tsx
  // src/app/api/users/[id]/route.ts
  export async function GET(request: Request, { params }: { params: { id: string } }) {
    // Handle GET /api/users/123
    return Response.json({ user: { id: params.id } })
  }
  ```

#### 2. **Server Actions** (Alternative to API routes)
- **Server functions**: Create functions in any file with `"use server"`
  ```tsx
  // src/lib/actions.ts
  "use server"
  
  export async function createUser(formData: FormData) {
    // Server-side logic
    const name = formData.get('name')
    // Save to database
  }
  ```

#### 3. **Database & Utilities** (`src/lib/`)
- **Database connections**: `src/lib/db.ts`
- **Authentication**: `src/lib/auth.ts`
- **External API calls**: `src/lib/api.ts`

### 📁 Static Files

#### **Public Directory** (`public/`)
- Images: `public/images/`
- Icons: `public/icons/`
- Documents: `public/documents/`
- Access via: `/images/photo.jpg`

## Development Workflow

### 1. **Creating a New Page**
```bash
# Create a new page
mkdir src/app/products
touch src/app/products/page.tsx
```

### 2. **Creating a New API Endpoint**
```bash
# Create a new API route
mkdir src/app/api/products
touch src/app/api/products/route.ts
```

### 3. **Creating a New Component**
```bash
# Create a new component
touch src/components/ui/ProductCard.tsx
```

## Key Concepts

### **App Router vs Pages Router**
- **App Router** (what we're using): New Next.js 13+ approach
- File-based routing with `page.tsx` files
- Server components by default
- Better performance and features

### **Server vs Client Components**
- **Server Components** (default): Run on server, no JavaScript sent to client
- **Client Components**: Add `"use client"` at top of file for interactivity

### **Data Fetching**
- **Server Components**: Fetch data directly in component
- **API Routes**: Create endpoints for client-side fetching
- **Server Actions**: Handle form submissions and mutations

## Common Patterns

### **Layout Pattern**
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### **Page Pattern**
```tsx
// src/app/blog/page.tsx
export default async function BlogPage() {
  const posts = await fetchPosts() // Server-side data fetching
  
  return (
    <div>
      <h1>Blog</h1>
      {posts.map(post => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}
```

### **API Route Pattern**
```tsx
// src/app/api/posts/route.ts
export async function GET() {
  const posts = await getPostsFromDatabase()
  return Response.json(posts)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newPost = await createPost(data)
  return Response.json(newPost, { status: 201 })
}
```

## Best Practices

1. **Keep components small and focused**
2. **Use TypeScript for better development experience**
3. **Organize by feature, not by type**
4. **Use server components when possible**
5. **Handle errors gracefully**
6. **Follow naming conventions consistently**

## Getting Started

1. **Start development server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Start production server**: `npm start`
4. **Lint code**: `npm run lint`

## Useful Commands

```bash
# Create new page
mkdir src/app/new-page && touch src/app/new-page/page.tsx

# Create new API route
mkdir src/app/api/new-endpoint && touch src/app/api/new-endpoint/route.ts

# Create new component
touch src/components/ui/NewComponent.tsx

# Install new package
npm install package-name

# Add TypeScript types
npm install @types/package-name
```

This structure follows Next.js best practices and provides a scalable foundation for your RSS project!
