# Drawing Grid Maker - MERN Stack Application

A complete MERN stack application for creating customizable drawing grids over images with authentication, project management, and export functionality.

## 🚀 Features

### 🔑 Authentication
- User signup/login with email & password
- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected routes for projects

### 🖼️ Image Upload
- Support for PNG/JPG image uploads
- Drag-and-drop interface
- File size validation (max 10MB)
- Server storage with GridFS support

### 📐 Grid Features
- Adjustable rows (1-50) and columns (1-50)
- Customizable line thickness (1-20px)
- Color picker for grid lines
- Toggle grid visibility (show/hide)
- Optional diagonal lines inside cells
- Reset to default settings
- Real-time preview

### 📤 Export Features
- Export final image + grid overlay as PNG
- Preserves all user settings
- High-quality canvas rendering
- Direct download functionality

### 🖥️ Frontend (React)
- **Authentication Pages**: Login/Signup with form validation
- **Dashboard**: Project management with thumbnails and metadata
- **Editor**: Main workspace with canvas and control panels
- **Responsive Design**: Works on desktop and tablet devices

## 🛠️ Technology Stack

- **Frontend**: React.js, HTML5 Canvas, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **File Upload**: Multer middleware
- **Image Processing**: HTML5 Canvas API

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

### Upload Routes
- `POST /api/upload` - Upload image file

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
    gridVisible: Boolean (default: true)
  },
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