import { Link } from 'react-router-dom';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { Icon } from '@iconify/react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar - Clean and Simple */}
      <Navbar maxWidth="xl" className="border-b border-divider">
        <NavbarBrand>
          {/* Subtle Brand Icon */}
          <Icon icon="lucide:check-circle" className="text-xl text-primary-500 mr-2" />
          <p className="font-semibold text-inherit text-lg">TodoApp</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              to="/login"
              variant="light" // Less emphasis than primary CTA
              color="primary"
              className="font-medium"
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              to="/signup"
              variant="flat" // Slightly more emphasis than login
              color="primary"
              className="font-medium"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Main Content - Increased Spacing and Focus */}
      <main className="flex-grow container mx-auto px-6 py-20 md:py-32">
        {/* Hero Section - Clear Hierarchy */}
        <div className="max-w-3xl mx-auto text-center mb-24 md:mb-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Focus on your day,<br /> not your todo list.
          </h1>
          <p className="text-lg md:text-xl text-default-600 mb-10 max-w-xl mx-auto">
            TodoApp helps you organize tasks effortlessly so you can achieve more with less stress.
          </p>
          <Button
            as={Link}
            to="/signup"
            color="primary"
            size="lg" // Prominent CTA
            endContent={<Icon icon="lucide:arrow-right" className="ml-1" />}
            className="font-semibold px-8 py-3 text-base" // Custom padding for better feel
          >
            Get Started Free
          </Button>
        </div>

        {/* Features Section - Clarity and Simplicity */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-primary-100 text-primary-600">
              <Icon icon="lucide:list-checks" className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
            <p className="text-default-600">Keep track of your tasks with a clean, intuitive interface designed for clarity.</p>
          </div>
          <div className="text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-primary-100 text-primary-600">
               <Icon icon="lucide:smartphone" className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Access Anywhere</h3>
            <p className="text-default-600">Seamlessly sync across all your devices. Your tasks are always within reach.</p>
          </div>
          <div className="text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-primary-100 text-primary-600">
               <Icon icon="lucide:sparkles" className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Effortless Flow</h3>
            <p className="text-default-600">Focus on what matters with a minimal design that gets out of your way.</p>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-divider py-8 mt-16">
        <div className="container mx-auto px-6 text-center md:text-left md:flex justify-between items-center">
          <div className="text-default-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TodoApp | made by <a href="https://github.com/han669669">han 🌟</a> 
          </div>
          <div className="flex gap-6 justify-center md:justify-start text-sm">
            {/* Using simple links instead of buttons for minimalism */}
            <Link to="/privacy" className="text-default-500 hover:text-primary-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-default-500 hover:text-primary-500 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-default-500 hover:text-primary-500 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};