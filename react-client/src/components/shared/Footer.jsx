

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {currentYear} Student Management System. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-400">
              Built with React and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;