# MockUniversity 🎓

A modern, responsive university website built with HTML, CSS, JavaScript, and Netlify Functions. Features a complete frontend with backend API functionality for student applications, authentication, and contact forms.

## 🌟 Features

### Frontend
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Interactive UI**: Smooth animations, hover effects, and dynamic content
- **Academic Programs**: Detailed program information with modal displays
- **Student Portal**: Login system with demo credentials
- **Application System**: Complete application form with validation
- **Contact Forms**: Multi-department routing system

### Backend (Netlify Functions)
- **Application Processing**: `/api/submit-application` - Handle student applications
- **Student Authentication**: `/api/student-auth` - Secure login system
- **Contact Form**: `/api/contact-form` - Route inquiries to appropriate departments
- **Program Data**: `/api/get-programs` - Dynamic program information

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/swetharajan7/MockUniversity.git
   cd MockUniversity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or for functions development
   npm run functions:dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Deploy to Netlify

#### Option 1: Git Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will automatically deploy on every push

#### Option 2: Manual Deploy
1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   # Preview deployment
   npm run preview
   
   # Production deployment
   npm run deploy
   ```

#### Option 3: Drag & Drop
1. Build your site: `npm run build`
2. Drag the entire project folder to [Netlify Drop](https://app.netlify.com/drop)

## 🏗️ Project Structure

```
MockUniversity/
├── index.html              # Main landing page
├── css/
│   └── style.css          # Additional styles (if needed)
├── js/
│   └── script.js          # Frontend JavaScript
├── netlify/
│   └── functions/         # Serverless backend functions
│       ├── submit-application.js
│       ├── student-auth.js
│       ├── contact-form.js
│       └── get-programs.js
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎯 API Endpoints

### POST `/api/submit-application`
Submit a new student application
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "program": "computer-science",
  "message": "Why I want to join..."
}
```

### POST `/api/student-auth`
Authenticate student login
```json
{
  "studentId": "DEMO001",
  "password": "password123"
}
```

### POST `/api/contact-form`
Submit contact form
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "admissions",
  "message": "I have a question about..."
}
```

### GET `/api/get-programs`
Get all academic programs or specific program by ID
```
/api/get-programs
/api/get-programs?id=computer-science
```

## 🔐 Demo Credentials

### Student Portal Login
- **Student ID**: `DEMO001`
- **Password**: `password123`

or

- **Student ID**: `STUDENT1`
- **Password**: `mockuniv2025`

## 🎨 Customization

### Colors & Branding
Update CSS variables in `index.html`:
```css
:root {
  --brand-1: #1976d2;    /* Primary blue */
  --brand-2: #7c4dff;    /* Secondary purple */
  --text: #0f172a;       /* Text color */
  --muted: #475569;      /* Muted text */
}
```

### Programs
Edit the programs array in `netlify/functions/get-programs.js` to add/modify academic programs.

### Contact Routing
Modify department routing in `netlify/functions/contact-form.js` to change email routing logic.

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Stacked layout with collapsible navigation
- **Mobile**: Single column with hamburger menu

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Deployment**: Netlify
- **Icons**: Google Material Icons
- **Fonts**: Google Fonts (Roboto)

## 🚀 Performance Features

- **Lazy Loading**: Images and content load as needed
- **Caching**: Static assets cached for 1 year
- **Compression**: Automatic Gzip compression
- **CDN**: Global content delivery via Netlify
- **Security Headers**: XSS protection, content type sniffing prevention

## 📊 Analytics & Monitoring

The site is ready for:
- Google Analytics
- Netlify Analytics
- Error tracking (Sentry, etc.)
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: [GitHub Issues](https://github.com/swetharajan7/MockUniversity/issues)
- **Discussions**: [GitHub Discussions](https://github.com/swetharajan7/MockUniversity/discussions)

## 🎉 Live Demo

Visit the live site: [MockUniversity](https://mockuniversity.netlify.app)

---

**MockUniversity** - Empowering minds, shaping futures through innovative online education. 🚀