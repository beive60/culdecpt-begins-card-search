import React from "react";
import { Stack, Text } from "@mantine/core";

export const Footer: React.FC = () => {
  return (
    <Stack align="center" gap={4} py="lg" px="md">
      <Text size="xs" c="dimmed" ta="center">
        当サイトのカードデータおよび画像は「カルドセプトラボ」より引用したものであり、非営利目的のファンツールとして公開されています。
      </Text>
      <Text size="xs" c="dimmed" ta="center">
        カルドセプト、Culdcept は有限会社大宮ソフトの登録商標です。&copy; Omiya Soft. &copy; Neos Corporation.
      </Text>
      <Text size="xs" c="dimmed" ta="center" style={{ fontSize: 10 }}>
        Source code is licensed under the MIT License.
      </Text>
    </Stack>
  );
};