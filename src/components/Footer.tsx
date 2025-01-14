const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 mt-auto">
      <div className="container mx-auto text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Guitar Journey. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;