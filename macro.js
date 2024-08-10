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

        .invitem .item-icon {
            width: 50px;
            max-width: 50px;
            height: 50px;
            max-height: 50px;
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

        .inventory-item-tooltip {
            z-index: 1;
            pointer-events:none;
            visibility: hidden;
            position: absolute;
            min-width: 400px;
            max-width: 400px;
            min-height: 150px;
            color: rgb(240, 240, 224);
            background-attachment: scroll;
            background-clip: border-box;
            background-color: rgba(0, 0, 0, 0.9);
            background-image: none;
            background-origin: padding-box;
            background-position-x: 0%;
            background-position-y: 0%;
            background-repeat: repeat;
            background-size: auto;
            border-bottom-color: rgb(35, 34, 29);
            border-bottom-style: solid;
            border-bottom-width: 9px;
            border-image-outset: 0;
            border-image-repeat: repeat;
            border-image-slice: 9;
            border-image-source: url(systems/pf2e/assets/sheet/corner-box.webp);
            border-image-width: 1;
            border-left-color: rgb(35, 34, 29);
            border-left-style: solid;
            border-left-width: 9px;
            border-right-color: rgb(35, 34, 29);
            border-right-style: solid;
            border-right-width: 9px;
            border-top-color: rgb(35, 34, 29);
            border-top-style: solid;
            border-top-width: 9px;
            box-shadow: rgba(0, 0, 0, 0.8) 0px 0px 20px 0px;
        }

        .invitem:hover .inventory-item-tooltip {
            visibility: visible;
        }
        
        .invitem-common .inventory-item-tooltip {
            background: linear-gradient(rgba(25, 24, 19, 0.9), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9), rgba(25, 24, 19, 0.9));
        }
        
        .invitem-uncommon .inventory-item-tooltip {
            background: linear-gradient(rgba(152, 81, 61, 0.9), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9), rgba(152, 81, 61, 0.9));
        }
        
        .invitem-rare .inventory-item-tooltip {
            background: linear-gradient(rgba(0, 38, 100, 0.9), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9), rgba(0, 38, 100, 0.9));
        }
        
        .invitem-unique .inventory-item-tooltip {
            background: linear-gradient(rgba(84, 22, 110, 0.9), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9), rgba(84, 22, 110, 0.9));
        }
        
        .inventory-item-tooltip .item-img {
            display: block;
            width: 125px;
            height: 125px;
            float: right;
            margin-top: -6px;
            margin-right: -6px;
            mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,1), rgba(0,0,0,0));
            mask-mode: alpha;
            box-shadow: 0 30px 40px 40px rgba(0,0,0,.1);
            border: none;
        }

        .inventory-item-tooltip .item-stats {
            min-height: 125px;
        }
        
        .inventory-item-tooltip .item-name {
            font-weight: bold;
            font-size: 20px;
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

    return htmlInventory.replaceAll("{{items}}", html)
}

const htmlItem = `
    <div class="invitem {{rarity_style}}">
        <img class="item-icon" src="{{item.img}}" />
        {{item_tooltip}}
    </div>
`;

function renderItem(item) {
    let html = htmlItem.replaceAll("{{item.img}}", item.img)
    html = html.replaceAll("{{rarity_style}}", "invitem-" + item.system.traits.rarity)
    html = html.replaceAll("{{item.name}}", item.name)
    html = html.replaceAll("{{item_tooltip}}", renderItemTooltip(item))
    return html
}

const htmlItemTooltip = `
    <aside class="inventory-item-tooltip">
        <img class="item-img" src="{{item.img}}" />  
        <div class="item-stats">
            <div class="item-name">{{item.name}}{{quantity}}</div>
            {{potency_rune_text}}
            {{striking_rune_text}}
            {{weapon_damage_text}}
        </div>
        <div class="item-description">{{item.system.description.value}}</div>
    </aside>
`;

function renderItemTooltip(item) {
    let html = htmlItemTooltip
    .replaceAll("{{item.img}}", item.img)
    .replaceAll("{{item.name}}", item.name)
    .replaceAll("{{quantity}}", getItemQuantity(item))
    .replaceAll("{{potency_rune_text}}", getPotencyRuneText(item))
    .replaceAll("{{striking_rune_text}}", getStrikingRuneText(item))
    .replaceAll("{{weapon_damage_text}}", getWeaponDamageText(item))
    .replaceAll("{{item.system.description.value}}", item.system.description.value)
    return html
}

function getItemQuantity(item) {
    if (item.system.quantity) {
        if (["consumable","treasure"].includes(item.type) || item.system.quantity > 1) {
           return " (" + item.system.quantity + ")"
        }
    }
    return ""
}

function getPotencyRuneText(item) {
    if (item.type != "weapon") {
        return ""
    }
    if (item.system.runes.potency > 0) {
        return '<div class="tooltip-item-weapon-potency-rune-text">' + "+" + item.system.runes.potency + '</div>'
    }
    return ""
}

function getStrikingRuneText(item) {
    if (item.type != "weapon") {
        return ""
    }
    if (item.system.runes.striking == 0) {
        return ""
    }

    switch (item.system.runes.striking) {
        case 1:
            return '<div class="tooltip-item-weapon-striking-rune-text">Разящая</div>'
        case 2:
            return '<div class="tooltip-item-weapon-striking-rune-text">Сильно Разящая</div>'
        case 3:
            return '<div class="tooltip-item-weapon-striking-rune-text">Отлично Разящая</div>'
        default:
            return "";
    }
}

function getWeaponDamageText(item) {
    if (item.type != "weapon") {
        return ""
    }
    return "<div class=\"tooltip-item-weapon-damage-text\">" + item.system.damage.dice + item.system.damage.die + " " + item.system.damage.damageType + "</div>"
}

function renderInventoryDialog(items) {
    return htmlStyles + renderInventory(items);
}


const targetItemTypes = [
    "equipment",
    "consumable",
    "treasure",
    "armor",
    "weapon",
    "backpack"
];

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
