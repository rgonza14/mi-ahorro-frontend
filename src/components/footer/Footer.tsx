import { Github, Globe, Linkedin, SquareCode } from 'lucide-react';

export const SOCIALS = {
    github: "https://github.com/rgonza14",
    linkedin: "https://www.linkedin.com/in/rgonza14/",
    website: "https://rgonza14.github.io/",
};


const Footer = () => {
    return (
        <footer className="py-6 border-t border-gray-200 mt-12">
            <div className="mx-auto w-[95%] md:w-[50%] flex flex-col md:flex-row items-center justify-between gap-4">


                <div className="flex items-center gap-x-3  font-medium">
                    <SquareCode className="w-5 h-5" />
                    <span>Ruiz Gonzalo</span>
                </div>


                <div className="flex items-center gap-x-5">
                    <a
                        href={SOCIALS.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className=" hover:text-black transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </a>

                    <a
                        href={SOCIALS.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="hover:text-blue-600 transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>

                    <a
                        href={SOCIALS.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Sitio web"
                        className=" hover:text-emerald-600 transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                    </a>
                </div>
            </div>


        </footer>
    );
};

export default Footer;
