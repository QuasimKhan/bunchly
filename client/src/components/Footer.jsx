const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 px-6 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                    <h3 className="text-white font-semibold mb-3">Bunchly</h3>
                    <p className="text-sm">
                        A premium link-in-bio platform for modern creators.
                    </p>
                </div>

                <FooterCol
                    title="Product"
                    links={["Features", "Pricing", "Themes"]}
                />
                <FooterCol
                    title="Company"
                    links={["About", "Privacy", "Terms"]}
                />
                <FooterCol title="Support" links={["Help Center", "Contact"]} />
            </div>

            <p className="text-center text-xs mt-12 opacity-60">
                © {new Date().getFullYear()} Bunchly. All rights reserved.
            </p>
        </footer>
    );
};

const FooterCol = ({ title, links }) => (
    <div>
        <h4 className="text-white font-semibold mb-3">{title}</h4>
        <ul className="space-y-2 text-sm">
            {links.map((l) => (
                <li key={l} className="hover:text-white cursor-pointer">
                    {l}
                </li>
            ))}
        </ul>
    </div>
);

export default Footer;
