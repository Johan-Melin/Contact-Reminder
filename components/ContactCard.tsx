import { View, Pressable } from "react-native";
import { Text } from "~/components/nativewindui/Text";
import { Avatar, AvatarFallback } from "./nativewindui/Avatar";

export const ContactCard = ({ contact, ...props }: { contact: any }) => {
  return (
    <Pressable {...props} style={{elevation: 8 }} className="shadow-sm rounded-xl p-4 bg-card flex-row items-center">
      <Avatar alt={contact.name}>
        <AvatarFallback className="bg-primary">
          <Text className="text-2xl text-white">{contact.name.charAt(0).toUpperCase()}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="ml-4">
        <Text className="font-bold">{contact.name}</Text>
        <Text>
          {contact.lastContact
            ? "Last Contact: " + new Date(contact.lastContact).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : ""}
        </Text>
        {contact.shouldContact && (
          <Text className="text-red-500">Should Contact</Text>
        )}
      </View>
    </Pressable>
  );
};