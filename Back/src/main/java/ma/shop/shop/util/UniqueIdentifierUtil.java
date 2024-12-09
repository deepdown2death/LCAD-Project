package ma.shop.shop.util;

import java.util.UUID;

public class UniqueIdentifierUtil {
    /**
     * Generates a unique identifier with a given prefix.
     *
     * @param prefix the prefix to be used in the unique identifier
     * @return a unique identifier with the specified prefix
     */
    public static String generateUniqueIdentifier(String prefix) {
        return prefix + UUID.randomUUID().toString().substring(0, 8);
    }

}
