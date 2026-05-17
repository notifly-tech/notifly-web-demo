import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", ".open-next/**", ".wrangler/**", "out/**", "build/**", "next-env.d.ts", "scripts/**"],
  },
];

export default eslintConfig;
