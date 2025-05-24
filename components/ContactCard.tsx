import { View, Pressable } from "react-native";
import { Text } from "~/components/nativewindui/Text";
import { Avatar, AvatarFallback } from "./nativewindui/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from '~/lib/useColorScheme';

export const ContactCard = ({ contact, ...props }: { contact: any }) => {
  const { colors } = useColorScheme();
  return (
    <Pressable {...props} style={{elevation: 8 }} className="shadow-sm rounded-xl p-4 bg-card flex-row items-center">
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center">
          <Avatar alt={contact.name}>
            <AvatarFallback className="bg-indigo-300">
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
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </View>
    </Pressable>
  );
};