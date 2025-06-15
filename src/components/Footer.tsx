import Hr from "./Header/Hr";
import Socials from "./Socials";

interface FooterProps {
  noMarginTop?: boolean;
}

export default function Footer({ noMarginTop = false }: FooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={noMarginTop ? "" : "mt-auto w-full"}>
      <Hr noPadding />
      <div className="footer-wrapper flex flex-col items-center justify-between py-6 sm:flex-row-reverse sm:py-4">
        <Socials centered />
        <div className="copyright-wrapper my-2 flex flex-col items-center whitespace-nowrap sm:flex-row">
          <span>© &#169; {currentYear}. </span>
          <span>Flik. </span>
          <span>all rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
