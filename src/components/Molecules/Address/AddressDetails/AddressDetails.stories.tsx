import { type Meta, type StoryObj } from "@storybook/react";
import { AddressDetails as AddressDetailsComponent } from "./AddressDetails";

type Story = StoryObj<typeof AddressDetailsComponent>;

const meta: Meta<typeof AddressDetailsComponent> = {
    title: "Molecules/Address/Address Details",
    component: AddressDetailsComponent,
};

export default meta;

export const AddressDetails: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
