# Mylegos

It is an app that makes monitoring your assets stored in lego sets easy! 🧱

![ScreenShot](https://i.imgur.com/Anl1Bgm.png)

## Demo

https://mylegos.vercel.app/

## Features

### Funcionality:

🔌 Login with Google <br/>
🌌 Left memory space indicator <br/>
🔎 Possibility to search items (with left searches indicator) <br/>
➕ Adding items to selected lists <br/>
✨ Switching mode to on **owned list 🏁** and **wanted list 👁️** <br/>
♻️ Setting item as owned or deleting it <br/>
🧮 Changing count of item <br/>
🔄 Refreshing items worth <br/>

### Appearance:

🎨 Custom app colors customization <br/>
📟 Support for mobile devices <br/>
👀 Item thumbnail <br/>
💸 Portfolio worth and count <br/>
🧊 3D models and plenty photos <br/>
📈 Price charts <br/>
📄 Item data <br/>
🔃 List sorting modes <br/>
&emsp; 👉 Release date <br/>
&emsp; 👉 Value <br/>
&emsp; 👉 Retail <br/>
&emsp; 👉 Count <br/>
&emsp; 👉 Change <br/>

## FAQ

#### How to search items?

You can search items like:

- Sets
- Minifigures
- Gear

Just go to **search** tab and type item number (e.g. 10281-1, 71028-11, pm029) or item name like "Diagon Alley" (this method might have some imperfections).

![ScreenShot](https://i.imgur.com/FrlAQTA.png)

#### How to see images and 3D models?

Firstly, open item with **info** button and click at the image on the left of item data.

![ScreenShot](https://i.imgur.com/iUwXRaX.png)

From there you can switch between view modes:

- Images view

![ScreenShot](https://i.imgur.com/fTHbD4c.png)

- 3D model view

![ScreenShot](https://i.imgur.com/5hdoibM.png)

#### How to see price changes?

Just hover over the chart in the item view, the tooltip will appear and show you detailed informations (this feature might not work properly on mobile devices).

![ScreenShot](https://i.imgur.com/pBgjNoE.png)

#### How to sort items in list?

Select option that is perfect for you.

![ScreenShot](https://i.imgur.com/8fk2p01.png)

Select type of sorting with arrow (ascending or descending).

![ScreenShot](https://i.imgur.com/yIphAfT.png)

#### How to switch list types?

Use toggle with **👁️ (owned list)** and **🏁 (wanted list)**.

![ScreenShot](https://i.imgur.com/ID3bMDv.png)

#### How to edit list?

Click the **edit** button and select action on the top right corner of item thumbnail (move option appears only in wanted list view). You can also change count of item with controler on bottom left corner.

![ScreenShot](https://i.imgur.com/lHKn1Yn.png)

#### How to manage theme?

Simply set the theme and click **save** button. This action will save it in database, so even if you switch devices your theme will be loaded with your account. If you changed the theme and it doesn't suits you, then click **load** button to restore old one.

![ScreenShot](https://i.imgur.com/3Y9k46O.png)

#### What does each procent indicator says?

Portfolio indicator:

![ScreenShot](https://i.imgur.com/JfWx5f9.png)

&emsp;`by what percentage is the value of items greater than sum of the retails?`

Item view indicators:

![ScreenShot](https://i.imgur.com/C5zb2V2.png)

&emsp;`by what percentage is the value greater than retail?`

![ScreenShot](https://i.imgur.com/h6CZCg2.png)

&emsp;`by what percentage did the value of the item change during the last sale?`

![ScreenShot](https://i.imgur.com/tWhqIdy.png)

&emsp;`by what percentage has the value of the item changed on the last selected sale?`

## Tech Stack

**Client:** Next.js, FontAwesome, Recharts

**Server:** Node.js

**Database:** Firebase

**API's:**

- https://www.exchangerate-api.com/
- https://www.bricklink.com/v3/api.page
- https://brickset.com/article/52664/api-version-3-documentation
- https://www.mecabricks.com/

## Feedback

If you have any feedback, please reach out to us at igorbialek0@gmail.com

## Authors

[@igorbialek](https://www.github.com/igorbialek)
