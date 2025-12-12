import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import packageJson from "../../core/package.json";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: `react-ol v${packageJson.version}`,
    },
  };
}
