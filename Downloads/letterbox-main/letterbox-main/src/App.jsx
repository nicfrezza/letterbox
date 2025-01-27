import { Link } from 'react-router-dom'; // Import Link for navigation

function App() {
  return (
    <div className="app-container">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full px-8 py-6 z-20 bg-white/80 backdrop-blur-sm">
        <ul className="flex gap-8 items-center">
          <li>
            <Link to="/" className="text-2xl font-serif text-[#6B5E49] hover:opacity-80 transition-all">
              LetterBox
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-[#6B5E49] hover:opacity-80 transition-all">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-[#6B5E49] hover:opacity-80 transition-all">
              Contact
            </Link>
          </li>
        </ul>
        <FirebaseProvider>
      {/* Your app components */}
    </FirebaseProvider>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 pt-20">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/2 relative h-screen">
          <div className="absolute inset-0">
            <img 
              src="./images/image.png"
              alt="Decorative"
              className="w-full h-full object-cover"
            />
            {/* Optional overlay */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="max-w-md">
            {/* Your content here */}
            <h1 className="text-4xl font-serif text-[#6B5E49] mb-4">
              Welcome to LetterBox
            </h1>
            <p className="text-[#6B5E49]">
              Your content goes here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
