export default function Footer() {
  return (
    <footer className="bg-secondary text-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              Just Buy It is your one-stop destination for premium Nike
              products. We offer the latest collections with fast shipping and
              excellent customer service.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/catalog"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Catalog
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Email: support@justbuyit.com
              <br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Just Buy It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
