// src/components/Navbar.tsx
import { useAuth } from '../context/AuthContext.tsx';
import PublicNavbar from './PublicNavbar.tsx';
import PrivateNavbar from './PrivateNavbar.tsx';

const Navbar = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; 
  return(  
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-16">
      {isAuthenticated ? <PrivateNavbar /> : <PublicNavbar />}

    </div>
    
  );
};

export default Navbar;
