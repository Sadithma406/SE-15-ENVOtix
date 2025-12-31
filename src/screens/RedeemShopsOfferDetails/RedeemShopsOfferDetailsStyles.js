const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  topBar: {
    height: 55,
    backgroundColor: "#2ecc71",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
  },

  headerTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "600",
  },

  image: {
    width: "100%",
    height: 210,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  discount: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },

  aboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  aboutText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  terms: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "#2ecc71",
  },

  navText: {
    fontSize: 12,
    color: "#777",
  },

  navTextActive: {
    fontSize: 12,
    color: "#2ecc71",
    fontWeight: "600",
  },
});
