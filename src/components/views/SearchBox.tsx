import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";

type View = "item" | "list";

export default function SearchBox({
  view,
  loading,
  onSearch,
}: {
  view: View;
  loading?: boolean;
  onSearch: (payload: { view: View; value: string }) => void;
}) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { search: "" },
    validate: {
      search: (value) =>
        value.length < 1
          ? "El término de búsqueda debe tener mas de 1 carácter"
          : null,
    },
  });

  const isItem = view === "item";
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    setHideText(true);
    form.reset();
    const t = setTimeout(() => setHideText(false), 220);
    return () => clearTimeout(t);
  }, [view]);

  return (
    <LayoutGroup>
      <form
        onSubmit={form.onSubmit((values) => {
          onSearch({ view, value: values.search });
        })}
      >
        {isItem ? (
          <Group mt="xl" w="100%" align="flex-end" gap="md">
            <motion.div
              layoutId="search-field"
              layout="position"
              style={{ flex: 1 }}
              transition={{ duration: 0.2 }}
            >
              <TextInput
                placeholder="Buscar producto..."
                key={form.key("search")}
                {...form.getInputProps("search")}
                size="md"
                style={{ textAlign: "start" }}
              />
            </motion.div>

            <motion.div
              layoutId="search-button"
              layout="position"
              transition={{ duration: 0.2 }}
            >
              <Button radius="lg" size="md" type="submit" loading={loading}>
                <span
                  style={{
                    opacity: hideText ? 0 : 1,
                    transition: "opacity 120ms ease",
                  }}
                >
                  Buscar
                </span>
              </Button>
            </motion.div>
          </Group>
        ) : (
          <Stack mt="xl" w="100%" gap="md">
            <motion.div
              layoutId="search-field"
              layout="position"
              transition={{ duration: 0.2 }}
              style={{ width: "100%" }}
            >
              <Textarea
                autosize
                minRows={4}
                placeholder="Pegá tu lista (1 ítem por línea)..."
                key={form.key("search")}
                {...form.getInputProps("search")}
                size="md"
                resize="vertical"
                style={{ textAlign: "start" }}
              />
            </motion.div>

            <motion.div
              layoutId="search-button"
              layout="position"
              transition={{ duration: 0.2 }}
              style={{ width: "100%" }}
            >
              <Button
                radius="lg"
                size="md"
                type="submit"
                fullWidth
                loading={loading}
              >
                <span
                  style={{
                    opacity: hideText ? 0 : 1,
                    transition: "opacity 120ms ease",
                  }}
                >
                  Buscar
                </span>
              </Button>
            </motion.div>
          </Stack>
        )}
      </form>
    </LayoutGroup>
  );
}
