const htmlStyles = `
    <style>
        .inventory {
            display: block;
            margin: 0;
            padding: 0;
        }

        .invitem {
            display: inline-block;
            float: left;
            margin: 0;
            padding: 0;
            width: 50px;
            max-width: 50px;
            height: 50px;
            max-height: 50px;
            overflow: hidden;
            border: 4px ridge rgba(0, 255, 255, 0.6);
        }
        
        .invitem-common {
            border: 4px ridge rgb(25, 24, 19);
        }
        
        .invitem-uncommon {
            border: 4px ridge rgb(152, 81, 61);
        }
        
        .invitem-rare {
            border: 4px ridge rgb(0, 38, 100);
        }
        
        .invitem-unique {
            border: 4px ridge rgb(84, 22, 110);
        }
    </style>
`;

const htmlInventory = `
    <div class="inventory">
        {{items}}
    </div>
`;

function renderInventory(items) {
    let html = ""
    for (let item of items) {
        html += renderItem(item)
    }

    return htmlInventory.replace("{{items}}", html)
}

const htmlItem = `
    <div class="invitem {{rarity_style}}"><img src="{{item.img}}"</img></div>
`;

function renderItem(item) {
    let html = htmlItem.replace("{{item.img}}", item.img)
    return html.replace("{{rarity_style}}", "invitem-" + item.system.traits.rarity)
}

const targetItemTypes = [
    "equipment",
    "consumable",
    "treasure",
    "armor",
    "weapon",
    "backpack"
];

function checkIfCoin(item) {
    return item.system.stackGroup == "coins"
}

function checkIfInBagPack(item) {
    return item.system.containerId != null
}

function renderInventoryDialog(items) {
    return htmlStyles + renderInventory(items);
}

function main() {
let inventoryItems = token.actor.items.filter(item => targetItemTypes.includes(item.type))
new Dialog({
    title: "Инвентарь",
    content: renderInventoryDialog(inventoryItems),
    buttons: {}
  },
  {resizable: true}
).render(true);
}

main();
