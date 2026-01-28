import React from "react";
import { AlertDialog, Button, XStack } from "tamagui";

interface AlertDialogProps {
  title: string;
  message: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "success" | "error" | "warning";
}

/**
 * 自定义 AlertDialog 组件
 *
 * 基于 Tamagui v4 的 defaultConfig，使用官方的主题和样式系统
 * 支持亮色/暗色主题自动切换
 *
 * @example
 * const [open, setOpen] = useState(false)
 * <CustomAlertDialog
 *   title="确认"
 *   message="确定要删除吗？"
 *   open={open}
 *   onOpenChange={setOpen}
 *   onConfirm={() => console.log('确认')}
 *   confirmText="删除"
 * />
 */
export function CustomAlertDialog({
  title,
  message,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmText = "确定",
  cancelText = "取消",
  type = "info",
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        {/* 半透明遮罩层 */}
        <AlertDialog.Overlay key="overlay" opacity={0.5} />

        {/* 对话框内容区域 */}
        <AlertDialog.Content
          key="content"
          bordered
          elevate
          gap="$4"
          p="$5"
          rounded="$4"
        >
          {/* 对话框标题 */}
          <AlertDialog.Title fontSize="$6" fontWeight="600">
            {title}
          </AlertDialog.Title>

          {/* 对话框描述内容 */}
          <AlertDialog.Description fontSize="$4" lineHeight="$5">
            {message}
          </AlertDialog.Description>

          {/* 按钮组 */}
          <XStack gap="$3" mt="$4" space="$2">
            {/* 取消按钮 - 仅在提供 onCancel 时显示 */}
            {onCancel && (
              <AlertDialog.Cancel asChild>
                <Button
                  flex={1}
                  borderWidth={1}
                  onPress={() => {
                    onCancel();
                    onOpenChange(false);
                  }}
                >
                  {cancelText}
                </Button>
              </AlertDialog.Cancel>
            )}

            {/* 确认按钮 */}
            <AlertDialog.Action asChild>
              <Button
                flex={1}
                fontWeight="600"
                onPress={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
              >
                {confirmText}
              </Button>
            </AlertDialog.Action>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
