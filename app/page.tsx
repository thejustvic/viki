import tw from "tailwind-styled-components";

const TwHome = tw.h1`
  text-3xl
  font-bold
  underline
`;

export default function Home() {
  return <TwHome>Hello viki!</TwHome>;
}
