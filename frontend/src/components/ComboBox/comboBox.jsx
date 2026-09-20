"use client";

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";

export const ComboBoxDashboard = ({
  icon,
  title,
  keterangan,
  hasil,
  satuan,
}) => {
  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  });

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      minH={"1vh"}>
      <Combobox.Control minH={"2vh"}>
        <Combobox.Input
          bg={"whiteAlpha.900"}
          color={"blackAlpha.800"}
          _placeholder={{ color: "#7d7b7b" }}
          minH={"4vh"}
          placeholder="Search Location..."
        />
        <Combobox.IndicatorGroup minH={"2vh"} color={"grey"}>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner color={"black"}>
          <Combobox.Content bg={"#f0eded"}>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item
                _highlighted={{
                  bg: "button.fifth",
                  color: "white",
                }}
                item={item}
                key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
};

const frameworks = [
  { label: "Jakarta", value: "jakarta" },
  { label: "Jakarta", value: "jakarta1" },
  { label: "Bogor", value: "bogor" },
  { label: "Bogor", value: "bogor1" },
  { label: "Depok", value: "depok" },
  { label: "Depok", value: "depok1" },
  { label: "Tangerang", value: "tangerang" },
  { label: "Tangerang", value: "tangerang1" },
  { label: "Bekasi", value: "bekasi" },
  { label: "Bekasi", value: "bekasi1" },
];
