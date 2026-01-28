import React from "react";
import { Text, styled } from "tamagui";

export type ThemedTextProps = React.ComponentProps<typeof Text> & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export const ThemedText = styled(Text, {
  name: "ThemedText",
  variants: {
    type: {
      default: {
        fontSize: "$4",
        lineHeight: "$4",
      },
      defaultSemiBold: {
        fontSize: "$4",
        lineHeight: "$4",
        fontWeight: "600",
      },
      title: {
        fontSize: "$9",
        fontWeight: "bold",
        lineHeight: "$9",
      },
      subtitle: {
        fontSize: "$6",
        fontWeight: "bold",
        lineHeight: "$6",
      },
      link: {
        fontSize: "$4",
        lineHeight: "$5",
        color: "$blue10",
      },
    },
  } as const,

  defaultVariants: {
    type: "default",
  },
});
