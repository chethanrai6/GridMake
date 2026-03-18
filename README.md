# GridCraft - MERN Stack Application

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
   git clone https://github.com/your-username/gridcraft.git
   cd gridcraft
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
MONGODB_URI=mongodb://localhost:27017/gridcraft

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
## 4.4 Database Design

### 4.4.1 Schema Design

#### Table 1: Users

| Field Name | Data Type | Constraint | Description |
|------------|-----------|-----------|-------------|
| userId | ObjectId | Primary Key | Unique ID for each user |
| name | String | NOT NULL | Full name of the user |
| email | String | NOT NULL, Unique | User email address |
| passwordHash | String | NOT NULL | Encrypted password (bcrypt) |
| createdAt | DateTime | NOT NULL | Account creation timestamp |
| updatedAt | DateTime | NOT NULL | Last update timestamp |

#### Table 2: Projects

| Field Name | Data Type | Constraint | Description |
|------------|-----------|-----------|-------------|
| projectId | ObjectId | Primary Key | Unique ID for each project |
| owner | ObjectId | Foreign Key (Users.userId), NOT NULL | User who owns the project |
| name | String | NOT NULL | Project name/title |
| imagePath | String | NOT NULL | Path to uploaded image file |
| gridSettings | Object | NOT NULL | Embedded document containing grid configuration |
| gridSettings.rows | Number | NOT NULL, Default: 10, Range: 1-50 | Number of grid rows |
| gridSettings.cols | Number | NOT NULL, Default: 10, Range: 1-50 | Number of grid columns |
| gridSettings.lineColor | String | NOT NULL, Default: '#000000' | Hex color code for grid lines |
| gridSettings.lineThickness | Number | NOT NULL, Default: 2, Range: 1-20 | Grid line thickness in pixels |
| gridSettings.diagonals | Boolean | NOT NULL, Default: false | Toggle diagonal lines |
| gridSettings.gridVisible | Boolean | NOT NULL, Default: true | Grid visibility toggle |
| gridSettings.showCellNames | Boolean | NOT NULL, Default: true | Cell naming (A1, B2) display |
| createdAt | DateTime | NOT NULL | Project creation timestamp |
| updatedAt | DateTime | NOT NULL | Last update timestamp |

#### Table 3: Blog

| Field Name | Data Type | Constraint | Description |
|------------|-----------|-----------|-------------|
| blogId | ObjectId | Primary Key | Unique ID for each blog post |
| title | String | NOT NULL | Blog post title |
| slug | String | NOT NULL, Unique | URL-friendly post identifier |
| excerpt | String | NOT NULL | Short summary of blog post |
| content | String | NOT NULL | Full blog content (markdown) |
| category | String | Enum: ['Tips', 'Tutorial', 'Feature', 'Update', 'Design', 'Other'] | Blog post category |
| tags | Array[String] | Optional | Search/filtering tags |
| featuredImage | String | Optional | Path to featured image file |
| author | ObjectId | Foreign Key (Users.userId), NOT NULL | User who created the post |
| authorName | String | NOT NULL | Author's display name |
| views | Number | NOT NULL, Default: 0 | Number of views |
| featured | Boolean | NOT NULL, Default: false | Featured post indicator |
| published | Boolean | NOT NULL, Default: false | Publication status |
| seoTitle | String | Optional | SEO meta title |
| seoDescription | String | Optional | SEO meta description |
| seoKeywords | String | Optional | SEO keywords |
| publishedAt | DateTime | Optional | Publication timestamp |
| createdAt | DateTime | NOT NULL | Post creation timestamp |
| updatedAt | DateTime | NOT NULL | Last update timestamp |

#### Table 4: GridSettings (Embedded in Projects)

| Field Name | Data Type | Constraint | Description |
|------------|-----------|-----------|-------------|
| rows | Number | Range: 1-50, Default: 10 | Number of grid rows |
| cols | Number | Range: 1-50, Default: 10 | Number of grid columns |
| lineColor | String | Hex color format, Default: '#000000' | Grid line color |
| lineThickness | Number | Range: 1-20px, Default: 2 | Line thickness |
| diagonals | Boolean | Default: false | Diagonal lines toggle |
| gridVisible | Boolean | Default: true | Grid visibility |
| showCellNames | Boolean | Default: true | Cell name display (A1, B2) |

### 4.4.2 Data Integrity and Constraints

- **Primary Key**: The primary key (ObjectId) uniquely identifies each record in a table, ensuring that every row can be accessed without ambiguity. MongoDB automatically generates unique ObjectId values.

- **Foreign Key**: Foreign keys establish relationships between tables. Project documents reference User.userId for ownership, and Blog documents reference User.userId for authorship. These relationships ensure valid links between related entities.

- **NOT NULL Constraint**: NOT NULL constraints ensure that mandatory fields always contain a value and prevent incomplete records. Critical fields like name, email, title, and content must always be provided.

- **Unique Constraint**: The Unique constraint prevents duplicate values in specific fields:
  - User.email - Ensures no two users share the same email address
  - Blog.slug - Ensures each blog post has a unique URL identifier

- **Enum Constraint**: Blog.category is restricted to predefined values (Tips, Tutorial, Feature, Update, Design, Other) to maintain consistent categorization.

- **Range Constraints**: Numeric fields have defined ranges to prevent invalid input:
  - GridSettings.rows & cols: 1-50 (prevents unreasonable grid dimensions)
  - GridSettings.lineThickness: 1-20 pixels (prevents rendering issues)

- **Referential Integrity**: Foreign key references must point to existing parent records:
  - A Project must reference an existing User (owner)
  - A Blog post must reference an existing User (author)
  - This prevents orphan records and maintains consistency across relationships

- **Validation Constraints**: Field-level validation ensures reliable data storage:
  - Email format validation with "@" and proper domain
  - Color format validation (valid hex codes)
  - File path validation for images
  - Markdown content validation for blog posts

- **Default Values**: Many fields have sensible defaults to ensure consistent application behavior:
  - GridSettings defaults ensure functional grids even if user doesn't customize
  - Boolean toggles default to intuitive states (gridVisible: true, showCellNames: true)
  - view count defaults to 0 for new posts

### 4.5 Design Constraints

The following constraints influenced the GridCraft system design:

- **File Upload and Download Behavior**: Image upload and download behavior depends on server storage configuration, supported file types (PNG/JPG), and maximum file size limits (10MB). Images are stored in the `/uploads` directory with proper validation.

- **Internet Connectivity**: Internet connectivity is mandatory for frontend-backend communication, JWT token exchange, and real-time grid preview updates. The system requires uninterrupted API connectivity for optimal performance.

- **Secure Token Handling**: Secure JWT token handling is required for protected routes such as project creation/update, blog publishing, and file uploads. Tokens are validated on every protected endpoint request.

- **Response Time Requirements**: Response time should remain acceptable even with increasing numbers of users, projects, and blog posts. Database indexing on frequently queried fields (User.email, Blog.slug, Project.owner) ensures optimal query performance.

- **Browser Canvas Limitations**: HTML5 Canvas rendering performance depends on image size and grid complexity. The system must handle large images efficiently without causing browser lag or memory issues.

- **Database Scalability**: The system must support growing collections of users, projects, and blog posts without significant performance degradation. MongoDB's horizontal scalability and proper indexing ensure long-term viability.

- **Modularity and Maintainability**: The system must remain modular and maintainable for future feature expansion such as:
  - Advanced filtering and search capabilities
  - User roles and permissions (Editor, Viewer, Admin)
  - Blog post ratings and comments
  - Collaborative project editing
  - Integration with third-party storage services (AWS S3, Google Cloud Storage)
  - API rate limiting and usage analytics

- **Security Best Practices**: The system implements multiple security layers:
  - Password hashing with bcrypt (not plain text storage)
  - JWT token-based authentication (stateless sessions)
  - Authorization checks on protected endpoints
  - File type and size validation on uploads
  - Input validation on all form submissions
  - CORS configuration to prevent unauthorized cross-origin requests
## � Testing & Results

### Chapter 6: Test Reports

#### 6.1.1 Authentication Module (Login)

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | Email and password fields left empty | System displays validation message for empty fields | ✅ Pass |
| 2 | Invalid email format | System displays error message for incorrect email format | ✅ Pass |
| 3 | Valid email but incorrect password | System displays authentication error message | ✅ Pass |
| 4 | Submit with valid credentials | User successfully logs in and redirected to dashboard | ✅ Pass |
| 5 | Expired JWT token | System refreshes token or redirects to login | ✅ Pass |

#### 6.1.2 Authentication Module (Signup)

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | All signup fields left empty | System displays validation messages for all fields | ✅ Pass |
| 2 | Invalid email format | Email validation checks for "@" and proper domain | ✅ Pass |
| 3 | Password less than required length | System displays password strength requirements | ✅ Pass |
| 4 | Email already exists in database | System displays "Email already registered" error | ✅ Pass |
| 5 | Submit valid details | New user account created successfully in database | ✅ Pass |
| 6 | Password successfully hashed | Password stored as bcrypt hash, not plain text | ✅ Pass |

#### 6.1.3 Project Management Module

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | Create new project with image upload | Project successfully created and stored in database | ✅ Pass |
| 2 | Upload unsupported file format | System rejects file and displays error message | ✅ Pass |
| 3 | Upload image exceeding size limit (>10MB) | System displays file size validation error | ✅ Pass |
| 4 | View list of user's projects | Dashboard displays all projects for logged-in user | ✅ Pass |
| 5 | Update project details | Project metadata updated successfully | ✅ Pass |
| 6 | Delete project | Project removed from database and dashboard | ✅ Pass |
| 7 | Access other user's project without permission | System returns 403 Forbidden error | ✅ Pass |

#### 6.1.4 Grid Editor Module

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | Adjust grid rows (1-50) | Grid updates in real-time with correct row count | ✅ Pass |
| 2 | Adjust grid columns (1-50) | Grid updates in real-time with correct column count | ✅ Pass |
| 3 | Change grid line color | Color picker updates grid lines to selected color | ✅ Pass |
| 4 | Adjust line thickness (1-20px) | Grid lines render with correct thickness | ✅ Pass |
| 5 | Toggle diagonal lines | Diagonals appear/disappear in grid cells | ✅ Pass |
| 6 | Toggle grid visibility | Grid shows/hides properly on canvas | ✅ Pass |
| 7 | Toggle cell naming display | Cell names (A1, B2, etc.) display correctly | ✅ Pass |
| 8 | Reset to default settings | All grid settings revert to default values | ✅ Pass |
| 9 | Export image with grid overlay | PNG file generated and downloaded successfully | ✅ Pass |

#### 6.1.5 Blog System Module

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | View public blog listing | All published blog posts display with pagination | ✅ Pass |
| 2 | Search blog posts by title | Search filter returns matching blog posts | ✅ Pass |
| 3 | Filter blogs by category | Blog posts filtered correctly by selected category | ✅ Pass |
| 4 | View featured blog posts section | Featured posts display in separate highlighted section | ✅ Pass |
| 5 | Click on blog post | Individual blog post opens with full content | ✅ Pass |
| 6 | View blog post increments view count | Views counter increases by 1 for each visit | ✅ Pass |
| 7 | Create new blog post (authenticated) | Blog post saved as draft successfully | ✅ Pass |
| 8 | Save blog post with all required fields | Blog post stored in database with all metadata | ✅ Pass |
| 9 | Upload featured image for blog | Image uploaded and associated with blog post | ✅ Pass |
| 10 | Add SEO metadata fields | SEO fields (title, description, keywords) saved | ✅ Pass |
| 11 | Publish draft blog post | Draft status changes to published and post appears publicly | ✅ Pass |
| 12 | Update published blog post | Changes saved and reflected immediately | ✅ Pass |
| 13 | Delete blog post | Post removed from database and blog listing | ✅ Pass |
| 14 | View draft posts (author only) | User sees only their own draft posts | ✅ Pass |
| 15 | Non-author cannot edit/delete blog | System returns 403 Forbidden for unauthorized users | ✅ Pass |

#### 6.1.6 Image Upload Module

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | Drag and drop image to upload | Image accepted and uploaded successfully | ✅ Pass |
| 2 | Click to select image file | File browser opens and image selection works | ✅ Pass |
| 3 | Upload PNG format | PNG image uploaded and stored correctly | ✅ Pass |
| 4 | Upload JPG format | JPG image uploaded and stored correctly | ✅ Pass |
| 5 | Upload unsupported format (GIF, BMP) | System rejects file with error message | ✅ Pass |
| 6 | Upload image exceeding size limit | System displays size validation error | ✅ Pass |
| 7 | Image preview displays | Preview shows uploaded image before confirmation | ✅ Pass |
| 8 | Images stored in server directory | Files saved to /uploads directory successfully | ✅ Pass |

#### 6.1.7 Authorization & Security Module

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | Access protected route without token | System redirects to login page | ✅ Pass |
| 2 | Access protected route with expired token | System requests re-authentication | ✅ Pass |
| 3 | JWT token validates correctly | Valid tokens grant access to protected routes | ✅ Pass |
| 4 | Tampered JWT token rejected | System rejects invalid/modified tokens | ✅ Pass |
| 5 | User cannot access other user's data | API returns 403 Forbidden for unauthorized access | ✅ Pass |
| 6 | Password hashing implemented | Passwords stored as bcrypt hashes | ✅ Pass |

#### 6.1.8 API Endpoints Functionality

| SL NO | TEST CASE | EXPECTED RESULT | TEST RESULT |
|-------|-----------|-----------------|-------------|
| 1 | POST /api/auth/signup | New user registered and JWT token returned | ✅ Pass |
| 2 | POST /api/auth/login | User authenticated and JWT token returned | ✅ Pass |
| 3 | GET /api/projects | Returns list of authenticated user's projects | ✅ Pass |
| 4 | POST /api/projects | Creates new project for authenticated user | ✅ Pass |
| 5 | GET /api/blog | Returns paginated list of published blogs | ✅ Pass |
| 6 | POST /api/blog | Creates new blog for authenticated user | ✅ Pass |
| 7 | GET /api/blog/featured/posts | Returns featured blogs (max 5) | ✅ Pass |
| 8 | GET /api/blog/:slug | Returns individual blog post data | ✅ Pass |
| 9 | GET /api/blog/categories | Returns available blog categories | ✅ Pass |
| 10 | POST /api/upload | Uploads image and returns file path | ✅ Pass |

### 6.2 Discussion

The comprehensive testing results indicate that all major modules of the GridCraft system are functioning correctly and reliably. Each feature was tested with both valid and invalid inputs to ensure robustness, data integrity, and security.

**Key Findings:**

1. **Authentication & Security**: The login and registration modules properly validate user inputs, implement secure password hashing with bcrypt, and handle JWT token-based authentication correctly. All unauthorized access attempts are properly blocked with appropriate error responses.

2. **Project Management**: The project creation, retrieval, update, and deletion operations function seamlessly. Image upload validation works correctly, rejecting unsupported formats and enforcing file size limits (max 10MB). Authorization checks prevent users from accessing or modifying other users' projects.

3. **Grid Editor**: All grid customization features work as expected in real-time. Users can adjust rows, columns, colors, thickness, and toggle visual elements (diagonals, cell names, visibility) without issues. The export functionality successfully generates PNG files with grid overlays.

4. **Blog System**: The blog module handles full CRUD operations smoothly. Content filtering by category and search by title work correctly. Draft/publish status management functions properly, with drafts visible only to authors. View counting increments accurately, and SEO metadata fields are stored and retrieved correctly.

5. **Image Handling**: Both project image uploads and blog featured image uploads function reliably. The system correctly validates file types and sizes, provides user-friendly error messages for invalid inputs, and stores images securely on the server.

6. **Data Validation & Error Handling**: Form validation works correctly for all user inputs. The system displays appropriate error messages and prevents invalid data from being stored in the database. API endpoints return correct HTTP status codes (200, 400, 403, 404) based on request outcomes.

7. **Performance & Stability**: All operations complete within acceptable timeframes. The pagination system handles blog listings efficiently. Database queries are optimized and return results promptly.

**Conclusion:**

All test cases have passed successfully (100% pass rate), demonstrating that GridCraft meets all required functional specifications. The system provides a stable, secure, and user-friendly experience with comprehensive input validation, proper error handling, and robust authorization controls. The application is ready for production deployment.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**GridCraft - Made with ❤️ for artists and designers who need perfect grids**