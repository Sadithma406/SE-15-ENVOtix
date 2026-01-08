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
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  appName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },

  categories: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eaeaea",
    borderRadius: 20,
    marginRight: 8,
  },

  categoryActive: {
    backgroundColor: "#2ecc71",
  },

  categoryText: {
    fontSize: 12,
    color: "#555",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    flex: 1,
    elevation: 2,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 110,
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  tag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#000000aa",
    paddingHorizontal: 6,
    borderRadius: 10,
  },

  tagText: {
    color: "#fff",
    fontSize: 10,
  },

  coins: {
    textAlign: "center",
    padding: 10,
    fontSize: 12,
    color: "#333",
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
