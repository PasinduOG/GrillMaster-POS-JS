# 🍔 GrillMaster Web POS

A modern, feature-rich Point of Sale (POS) system designed for burger restaurants. Built with vanilla JavaScript, HTML5, and CSS3, this web application provides a complete solution for managing orders, customers, and sales.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple.svg)

## 🌟 Features

### 📦 Order Management
- Real-time order creation and management
- Dynamic cart with item quantity controls
- Add, remove, and update order items instantly
- Automatic order ID generation
- Order history tracking with complete transaction details

### 💳 Payment Processing
- **Dual Payment Methods**: Cash and Card payments
- Cash payment with change calculation
- Card payment with exact amount processing
- Payment validation and error handling
- Receipt generation after successful checkout

### 👥 Customer Management
- Customer registration and profile management
- Save and retrieve customer information
- Phone number validation
- Guest checkout support
- Customer selection from saved profiles
- Duplicate customer detection

### 🧾 Invoice System
- Professional invoice generation
- Print-optimized invoice layout
- Detailed order breakdown with itemized pricing
- Payment method display
- Business information and branding
- Print-only mode (hides navigation and buttons)

### 🍽️ Menu Display
- Categorized product display (Burgers, Fries, Drinks)
- Product images and descriptions
- Real-time pricing display
- Responsive product cards
- Easy product selection

### 🔐 User Authentication
- Secure login system
- Session management with localStorage
- User profile display
- Logout functionality

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Smooth animations with AOS library

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5.x
- **Icons**: Font Awesome, Bootstrap Icons
- **Animations**: AOS (Animate On Scroll)
- **Alerts**: SweetAlert2
- **Data Storage**: LocalStorage for client-side persistence
- **Module System**: ES6 Modules

## 📁 Project Structure

```
GrillMaster-Web-POS/
├── index.html                 # Main entry point
├── admin.html                 # Admin panel (if applicable)
├── README.md                  # Project documentation
├── assets/                    # Static assets
├── components/                # Reusable UI components
│   ├── footer/
│   │   └── footer.html
│   ├── home/
│   │   └── home.html
│   ├── invoice/
│   │   └── invoice.html
│   ├── login/
│   │   └── login.html
│   ├── navbar/
│   │   └── navbar.html
│   ├── order_history/
│   │   └── order_history.html
│   └── pos/
│       └── pos.html
├── css/                       # Stylesheets
│   ├── bootstrap.min.css
│   └── style.css              # Custom styles
├── img/                       # Images
│   └── product_images/        # Product photos
├── js/                        # JavaScript modules
│   ├── app.js                 # Main POS logic
│   ├── index.js               # Page routing & initialization
│   ├── bootstrap.bundle.min.js
│   ├── fetchBurgers.js        # Burger data fetching
│   ├── fetchDrinks.js         # Drinks data fetching
│   ├── fetchFries.js          # Fries data fetching
│   └── fetchItems.js          # All items data fetching
└── json/                      # Data files
    ├── customer.json          # Customer accounts
    └── items.json             # Menu items database
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Live Server, XAMPP, WAMP, or similar)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PasinduOG/GrillMaster-POS-JS.git
   cd GrillMaster-POS-JS
   ```

2. **Start a local server**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Or using Node.js (http-server):
   ```bash
   npx http-server
   ```
   
   Or using VS Code Live Server extension (recommended)

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Default Login Credentials
Check `json/customer.json` for available login credentials.

## 💻 Usage

### For Cashiers

1. **Login**
   - Navigate to the login page
   - Enter your credentials
   - Access the POS system

2. **Create an Order**
   - Click on products to add them to the cart
   - Adjust quantities using +/- buttons
   - Remove items if needed
   - Total is calculated automatically

3. **Add Customer** (Optional)
   - Click "Customer" button
   - Select existing customer or enter new details
   - Save customer information

4. **Process Payment**
   - Click "CHARGE" button
   - Select payment method (Cash/Card)
   - For cash: Enter amount received
   - Click "Complete Payment"
   - Invoice is generated automatically

5. **Print Invoice**
   - Click "Print Invoice" button
   - Standard print dialog appears
   - Only invoice content is printed

6. **Continue**
   - Click "Back to POS" to start new order
   - Previous order is saved in history

## 🎨 Customization

### Modify Menu Items
Edit `json/items.json`:
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 2500.00,
  "product_type": "Burger",
  "ingredients": "Description",
  "image_url": "img/product_images/product.jpg"
}
```

### Add New Products
1. Add product data to `json/items.json`
2. Add product image to `img/product_images/`
3. Products appear automatically in POS

### Customize Styling
Edit `css/style.css` for custom styles and print layout adjustments.

### Business Information
Update invoice template in `js/index.js` → `generateInvoice()` function:
```javascript
<h1>Your Business Name</h1>
<p>Your Address</p>
<p>Phone: Your Phone</p>
<p>Email: Your Email</p>
```

## 📊 Data Persistence

The application uses localStorage to persist:
- Active orders
- Order history
- Customer information
- Registered customers
- User sessions
- Order IDs

**Note**: Data is stored locally in the browser and will be cleared if browser data is cleared.

## 🔧 Key Features Explained

### Order Flow
1. Login → 2. Select Products → 3. Add Customer (optional) → 4. Choose Payment Method → 5. Complete Payment → 6. Generate Invoice → 7. Print/Save → 8. Back to POS

### Payment Methods
- **Cash**: Requires amount input, calculates change
- **Card**: Auto-fills exact amount, no change needed

### Customer Management
- Guests allowed without registration
- Phone validation (10 digits, starts with 0)
- Duplicate prevention by phone number
- Auto-populate from saved customers

## 🐛 Known Issues & Solutions

- **Blank page after navigation**: Refresh the page
- **Items not loading**: Check browser console for errors
- **Print not working**: Ensure browser allows print dialog
- **LocalStorage full**: Clear browser data or implement data cleanup

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Pasindu Madhuwantha**
- GitHub: [@PasinduOG](https://github.com/PasinduOG)
- Repository: [GrillMaster-POS-JS](https://github.com/PasinduOG/GrillMaster-POS-JS)

## 🙏 Acknowledgments

- Bootstrap for responsive framework
- Font Awesome & Bootstrap Icons for iconography
- SweetAlert2 for beautiful alerts
- AOS for smooth animations

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for burger shops everywhere!** 🍔
