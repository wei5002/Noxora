import {
  Badge,
  Flex,
  HStack,
  Input,
  InputGroup,
  Stat,
  Text,
} from "@chakra-ui/react";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

export const DetailCard = ({ icon, title, keterangan, hasil, satuan }) => {
  return (
    <Flex
      w={"35vh"}
      bg={"card.primary"}
      borderRadius={"1vh"}
      p={"1.5vh"}
      gap={"1.5vh"}
      direction={"column"}>
      <Flex
        w={"100%"}
        align={"center"}
        justify={"center"}
        gap={"1vh"}
        direction={"row"}>
        {icon}
        <Flex
          w={"100%"}
          // align={"center"}
          justify={"center"}
          direction={"column"}>
          <Text fontSize={"2.25vh"} fontWeight={"bold"}>
            {title}
          </Text>
          <Text fontSize={"1.5vh"} color={"text.thrid"}>
            {keterangan}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={"1.5vh"} w={"100%"} align={"center"} justify={"center"}>
        <Text fontWeight={"bold"} fontSize={"4xl"}>
          {hasil}
        </Text>
        <Text fontSize={"2vh"}>{satuan}</Text>
      </Flex>
    </Flex>
  );
};

export const DetailCard2 = ({ icon, title, keterangan, hasil, satuan }) => {
  return (
    <Flex
      w={"100%"}
      bg={"card.primary"}
      borderRadius={"1vh"}
      p={"1.5vh"}
      gap={"1.5vh"}
      direction={"column"}>
      <Flex
        w={"100%"}
        align={"center"}
        justify={"center"}
        gap={"1vh"}
        direction={"row"}>
        <BiSolidBuildingHouse size={"5vh"} color="#89c6f5" />
        <Flex
          w={"100%"}
          // align={"center"}
          justify={"center"}
          direction={"column"}>
          <Text fontSize={"2.25vh"} fontWeight={"bold"}>
            {title}
          </Text>
          <Text fontSize={"1.5vh"} color={"text.thrid"}>
            {keterangan}
          </Text>
        </Flex>
      </Flex>
      <Flex gap={"1.5vh"} w={"100%"} align={"center"} justify={"center"}>
        <Text fontWeight={"bold"} fontSize={"2xl"}>
          {hasil}
        </Text>
        <Text fontSize={"2vh"}>{satuan}</Text>
      </Flex>
    </Flex>
  );
};

export const MiniCard = ({ icon, title, keterangan, hasil, satuan }) => {
  return (
    <Flex
      w={"100%"}
      p={"2.5vh"}
      borderRadius={"2vh"}
      bg={"bg.secondary"}
      // h={"fit-content"}
      direction={"column"}
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)">
      <Text fontSize={"xs"} color={"text.thrid"}>
        {title}
      </Text>
      <Text fontWeight={"bold"}>{hasil}</Text>
    </Flex>
  );
};

export const MiniCardLocation = ({ location, hasil }) => {
  return (
    <Flex
      w={"50%"}
      py={"2vh"}
      px={"2.5vh"}
      borderRadius={"2vh"}
      direction={"column"}
      bg={"bg.secondary"}
      gap={"0.5vh"}
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)">
      <Flex direction={"row"} align={"center"} gap={"0.5vh"} mb={"0.5vh"}>
        <FaLocationDot size={"1.75vh"} />
        <Text fontSize={"sm"}>{location}</Text>
      </Flex>
      {/* <Flex direction={"row"} justify={"center"} align={"center"} gap={"1vh"}>
        <Text fontWeight={"bold"} fontSize={"2xl"}>
          {hasil}
        </Text>
    
      </Flex> */}
      <Flex justify={"center"} align={"center"}>
        <Stat.Root gap={"1vh"} >
          <HStack justify="center">
            <Stat.ValueText>
              {hasil} <Text fontSize={"sm"}>μg/m³</Text>
            </Stat.ValueText>
          </HStack>
          <Flex justify={"space-between"} align={"center"}>
            <Stat.HelpText>Last Day</Stat.HelpText>
            <Badge bg="transparent" color="inherit" gap="0">
              <Stat.UpIndicator />
              12
            </Badge>
          </Flex>
        </Stat.Root>
      </Flex>
      {/* <Text>
        <Text fontSize={"sm"} color={"text.thrid"} textAlign={"end"}>
          naik 5.0
        </Text>
      </Text> */}
      <Flex
        borderTop={"1px solid #eae9e9"}
        pt={"0.75vh"}
        direction={"row"}
        justify={"space-between"}>
        <Text fontSize={"xs"} color={"text.thrid"}>
          See More
        </Text>
        <Text fontSize={"xs"} color={"text.thrid"}>
          {">"}
        </Text>
      </Flex>
    </Flex>
  );
};

export const InputPrediction = ({
  title,
  placeholder,
  value,
  onchange,
  satuan,
}) => {
  return (
    <Flex direction={"column"} w={"100%"}>
      <Text w={"100%"} fontSize={"sm"} fontWeight={"bold"}>
        {title}
      </Text>
      <InputGroup endAddon={satuan}>
        <Input
          bg={"whiteAlpha.900"}
          color={"blackAlpha.800"}
          h={"4vh"}
          value={value}
          onchange={onchange}
          placeholder={placeholder}
          _placeholder={{ color: "#7d7b7b" }}
        />
      </InputGroup>
    </Flex>
  );
};
