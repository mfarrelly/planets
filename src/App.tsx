import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { World } from "./world";
import { Select } from "@chakra-ui/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    Text,
    Button,
    SimpleGrid,
    GridItem,
    Box,
} from "@chakra-ui/react";

function App() {
    const [count, setCount] = useState(0);
    const [focusItem, setFocusItem] = useState<string | null>(null);

    return (
        <div className="App">
            <SimpleGrid gridColumn={2} gridRow={1} gap={2} autoFlow="row dense">
                <Box width={400}>
                    <Select
                        placeholder="Focus object"
                        onChange={(e) => setFocusItem(e.currentTarget.value)}
                    >
                        <option value="sun">Sun</option>
                        <option value="mercury">Mercury</option>
                        <option value="venus">Venus</option>
                        <option value="earth">Earth</option>
                    </Select>

                    <Button size="md">Update</Button>
                </Box>
                <Box height={800}>
                    <World focusItem={focusItem} />
                </Box>
            </SimpleGrid>
        </div>
    );
}

export default App;
