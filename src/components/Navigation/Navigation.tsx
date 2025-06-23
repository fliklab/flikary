// import { useState, useEffect } from "react";

// const Navigation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   useEffect(() => {
//     const currentTheme = localStorage.getItem("theme") as "light" | "dark";
//     setTheme(currentTheme || "light");
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.firstElementChild?.setAttribute("data-theme", newTheme);

//     const body = document.body;
//     if (body) {
//       const computedStyles = window.getComputedStyle(body);
//       const bgColor = computedStyles.backgroundColor;
//       document
//         .querySelector("meta[name='theme-color']")
//         ?.setAttribute("content", bgColor);
//     }
//   };

//   return (
//     <nav className="relative">
//       <button
//         id="hamburger"
//         className={`flex h-10 w-10 items-center justify-center rounded-full bg-skin-fill p-2 transition-all hover:bg-skin-card ${
//           isOpen ? "rotate-90" : ""
//         }`}
//         onClick={toggleMenu}
//         aria-label="Open Menu"
//       >
//         <div className={`hamburger-icon ${isOpen ? "open" : ""}`}>
//           <span className="bg-skin-accent" />
//           <span className="bg-skin-accent" />
//           <span className="bg-skin-accent" />
//         </div>
//       </button>

//       <div
//         className={`nav-menu absolute right-0 top-12 min-w-[200px] origin-top-right transform rounded-lg bg-skin-fill p-4 opacity-0 shadow-lg transition-all duration-500 ${
//           isOpen ? "visible scale-100 opacity-100" : "invisible scale-95"
//         }`}
//       >
//         <ul className="space-y-2">
//           <li>
//             <a
//               href="/archives"
//               className="block rounded-md px-4 py-2 text-skin-base hover:bg-skin-card hover:text-skin-accent"
//             >
//               Archives
//             </a>
//           </li>
//           <li>
//             <a
//               href="/search"
//               className="block rounded-md px-4 py-2 text-skin-base hover:bg-skin-card hover:text-skin-accent"
//             >
//               Search
//             </a>
//           </li>
//           <li>
//             <button
//               id="theme-btn"
//               className="flex w-full items-center rounded-md px-4 py-2 text-skin-base hover:bg-skin-card hover:text-skin-accent"
//               aria-label={theme}
//               onClick={toggleTheme}
//             >
//               {theme === "light" ? "Dark" : "Light"} Mode
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;
