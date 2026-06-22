
// Sample Instagram data for demo purposes.
// Structured to match the format importJSON expects: { date, name, posts[] }

const post = (id, date, caption, likes, reach, saved, impressions, engagement) => ({
  id: String(id),
  date,
  caption,
  likes,
  reach,
  saved,
  impressions,
  engagement
})

const t = (y, m, d) => new Date(y, m - 1, d).getTime()

export const sampleImport = {
  date: t(2021, 3, 15),
  name: 'sample_export',
  posts: [
    post(1,  t(2021, 3, 14), 'Morning coffee ritual ☕ #coffee #morningroutine #lifestyle #aesthetic #homecafe', 312, 4820, 87, 5640, 401),
    post(2,  t(2021, 3, 12), 'New workspace setup 💻 #wfh #workspace #desksetup #productivity #minimalist', 488, 7310, 142, 8900, 634),
    post(3,  t(2021, 3, 10), 'Weekend hike views 🏔️ #hiking #nature #outdoors #adventure #weekend', 621, 9450, 203, 11200, 824),
    post(4,  t(2021, 3,  8), 'Homemade sourdough 🍞 #baking #sourdough #homemade #bread #foodphotography', 274, 3980, 61, 4720, 335),
    post(5,  t(2021, 3,  6), 'City skyline at golden hour 🌆 #cityscape #goldenhour #photography #urban #lifestyle', 539, 8120, 178, 9870, 717),
    post(6,  t(2021, 3,  4), 'New book haul 📚 #reading #books #bookstagram #aesthetic #weekendvibes', 198, 2940, 44, 3510, 242),
    post(7,  t(2021, 3,  2), 'Plant corner update 🌿 #plants #plantparent #indoorplants #greenery #homecafe', 445, 6670, 121, 7840, 566),
    post(8,  t(2021, 2, 28), 'Sunrise run 🌅 #running #morningroutine #fitness #outdoors #lifestyle', 367, 5530, 98, 6480, 465),
    post(9,  t(2021, 2, 26), 'Avocado toast game strong 🥑 #brunch #foodphotography #homemade #aesthetic #weekend', 289, 4320, 73, 5090, 362),
    post(10, t(2021, 2, 24), 'Desk organization 🗂️ #desksetup #productivity #workspace #minimalist #wfh', 512, 7680, 167, 9320, 679),
    post(11, t(2021, 2, 22), 'Trail run in the fog 🌫️ #running #nature #outdoors #adventure #morningroutine', 403, 6050, 112, 7130, 515),
    post(12, t(2021, 2, 20), 'Latte art attempt ☕ #coffee #homecafe #morningroutine #aesthetic #baking', 331, 4970, 89, 5850, 420),
    post(13, t(2021, 2, 18), 'Bookshelf styling 📚 #bookstagram #reading #aesthetic #minimalist #lifestyle', 276, 4140, 68, 4890, 344),
    post(14, t(2021, 2, 16), 'Evening walk vibes 🌇 #goldenhour #cityscape #urban #photography #weekend', 458, 6880, 133, 8100, 591),
    post(15, t(2021, 2, 14), 'Valentine\'s Day bake 🍰 #baking #homemade #foodphotography #aesthetic #weekend', 587, 8800, 219, 10600, 806),
    post(16, t(2021, 2, 12), 'New succulent collection 🌵 #plants #plantparent #indoorplants #minimalist #homecafe', 322, 4830, 84, 5710, 406),
    post(17, t(2021, 2, 10), 'WFH lunch break 🥗 #wfh #productivity #lifestyle #homemade #foodphotography', 241, 3620, 57, 4280, 298),
    post(18, t(2021, 2,  8), 'Mountain trail sunset 🌄 #hiking #outdoors #nature #adventure #goldenhour', 673, 10100, 248, 12300, 921),
    post(19, t(2021, 2,  6), 'Coffee + code morning ☕ #coffee #wfh #desksetup #productivity #morningroutine', 356, 5340, 94, 6290, 450),
    post(20, t(2021, 2,  4), 'Reading nook inspo 📚 #reading #bookstagram #aesthetic #lifestyle #weekend', 298, 4470, 71, 5270, 369),
    post(21, t(2021, 2,  2), 'Fresh focaccia day 🍞 #baking #sourdough #homemade #foodphotography #weekendvibes', 411, 6170, 128, 7290, 539),
    post(22, t(2021, 1, 31), 'Monstera in morning light 🌿 #plants #indoorplants #plantparent #aesthetic #minimalist', 385, 5780, 107, 6820, 492),
    post(23, t(2021, 1, 29), 'Sprint session 🏃 #running #fitness #morningroutine #outdoors #adventure', 319, 4790, 82, 5650, 401),
    post(24, t(2021, 1, 27), 'City street photography 🏙️ #urban #cityscape #photography #lifestyle #goldenhour', 502, 7540, 158, 8940, 660),
  ]
}
