# Drawing Grid Maker - MERN Stack Application

A complete MERN stack application for creating customizable drawing grids over images with authentication, project management, blog system, and export functionality.

## 🚀 Features

### 🔑 Authentication
- User signup/login with email & password
- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected routes for projects and blog

### 🖼️ Image Upload
- Support for PNG/JPG image uploads
- Drag-and-drop interface
- File size validation (max 10MB)
- Server storage with GridFS support
- Featured image uploads for blog posts
- In-content markdown image uploads

### 📐 Grid Features
- Adjustable rows (1-50) and columns (1-50)
- Customizable line thickness (1-20px)
- Color picker for grid lines
- Toggle grid visibility (show/hide)
- Optional diagonal lines inside cells
- **Cell naming display** (A1, B2, C3... spreadsheet-style coordinates)
- Reset to default settings
- Real-time preview

### 📝 Professional Blog System
- **Full CRUD Operations**: Create, read, update, delete blog posts
- **Featured Posts**: Highlight important articles
- **Search & Filter**: Search posts by title, content, tags; filter by category
- **Categories**: Tips, Tutorial, Feature, Update, Design, Other
- **Draft/Publish Status**: Save drafts or publish posts
- **View Tracking**: Track number of views per post
- **SEO Optimization**: Meta title, description, keywords fields
- **Author Attribution**: Track author information and publish dates
- **Pagination**: Efficient pagination for blog listing
- **Professional UI**: Modern, responsive design with smooth animations

### 📤 Export Features
- Export final image + grid overlay as PNG
- Preserves all user settings
- High-quality canvas rendering
- Direct download functionality

### 🖥️ Frontend (React)
- **Authentication Pages**: Login/Signup with form validation
- **Dashboard**: Project management with thumbnails and metadata
- **Editor**: Main workspace with canvas and control panels
- **Blog Pages**: 
  - BlogPage: Public blog listing with search and filters
  - BlogPost: Individual post viewer with full content
  - BlogEditor: Editor for creating/editing posts (authenticated users only)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React.js, HTML5 Canvas, CSS3, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **File Upload**: Multer middleware
- **Image Processing**: HTML5 Canvas API, Sharp
- **API**: RESTful API with proper error handling

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/drawing-grid-maker.git
   cd drawing-grid-maker
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Copy environment variables
   cp .env.example .env

   # Edit .env with your configuration
   nano .env
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

6. **Start the application**
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev

   # Terminal 2: Start frontend
   cd client
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/drawing_grid_maker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=10485760

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Project Routes
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Blog Routes (Public & Protected)
**Public Endpoints:**
- `GET /api/blog` - List all published blog posts with pagination
- `GET /api/blog/featured/posts` - Get featured blog posts (max 5)
- `GET /api/blog/categories` - Get available blog categories
- `GET /api/blog/:slug` - Get individual blog post by slug

**Protected Endpoints (Authenticated Users Only):**
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post (author only)
- `DELETE /api/blog/:id` - Delete blog post (author only)
- `GET /api/blog/author/drafts` - Get user's draft posts

### Upload Routes
- `POST /api/upload` - Upload image file
- `POST /api/upload/blog` - Upload blog featured image or in-content image

## 📊 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  createdAt: Date (default: Date.now)
}
```

### Project Model
```javascript
{
  owner: ObjectId (ref: 'User', required),
  name: String (required),
  imagePath: String (required),
  gridSettings: {
    rows: Number (default: 10),
    cols: Number (default: 10),
    lineColor: String (default: '#000000'),
    lineThickness: Number (default: 2),
    diagonals: Boolean (default: false),
    gridVisible: Boolean (default: true),
    showCellNames: Boolean (default: true)
  },
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Blog Model
```javascript
{
  title: String (required),
  slug: String (required, unique),
  excerpt: String (required),
  content: String (required, markdown),
  category: String (enum: ['Tips', 'Tutorial', 'Feature', 'Update', 'Design', 'Other']),
  tags: [String],
  featuredImage: String,
  author: ObjectId (ref: 'User', required),
  authorName: String,
  views: Number (default: 0),
  featured: Boolean (default: false),
  published: Boolean (default: false),
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  publishedAt: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Made with ❤️ for artists and designers who need perfect grids**