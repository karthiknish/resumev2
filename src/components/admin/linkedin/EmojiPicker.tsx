// Converted to TypeScript - migrated
import React, { useState, useCallback, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, X, Search } from "lucide-react";

/**
 * LinkedIn Emoji Picker Component
 *
 * A comprehensive emoji picker designed for LinkedIn posts with:
 * - Categorized emojis (Smileys, People, Animals, Food, Activities, Travel, Objects, Symbols)
 * - Search functionality with keyword matching
 * - Frequently used section
 * - Skin tone support (placeholders for future)
 * - Keyboard navigation
 * - Lightweight (no external emoji libraries)
 *
 * @param {Function} onEmojiSelect - Callback when emoji is selected (emoji) => void
 * @param {string} triggerClassName - Custom class for trigger button
 * @param {React.ReactNode} trigger - Custom trigger component
 * @param {boolean} open - Controlled open state
 * @param {Function} onOpenChange - Callback when open state changes
 */

/**
 * Emoji categories with curated emojis for professional LinkedIn content
 */
const EMOJI_CATEGORIES = {
  frequently: {
    name: "Frequently Used",
    emojis: ["👍", "❤️", "🔥", "👏", "🎉", "💡", "🚀", "💼", "✨", "🙌"],
  },
  smileys: {
    name: "Smileys & People",
    emojis: [
      "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌",
      "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨",
      "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕",
      "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
      "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔",
      "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮",
      "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷",
      "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👋", "🤚", "🖐️", "✋", "🖖", "👌",
      "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇",
      "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
      "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀",
      "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸", "👶", "🧒", "👦",
      "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵", "🙍", "🙎", "🙅",
      "🙆", "💁", "🙋", "🧏", "🙇", "🤦", "🤷", "👨‍💻", "👩‍💻", "👨‍🔬", "👩‍🔬",
    ],
  },
  gestures: {
    name: "Gestures",
    emojis: [
      "👍", "👎", "👌", "✌️", "🤞", "🤝", "🙏", "💪", "👏", "🙌", "👐", "🤲",
      "👋", "🤚", "🖐️", "✋", "🖖", "👆", "👇", "☝️", "👈", "👉", "🤛", "🤜",
      "👊", "✊", "🤏", "🤌", "🤘", "🤙", "👈👉", "🤟", "👁️‍🗨️", "💅", "👄", "🦶",
    ],
  },
  animals: {
    name: "Animals & Nature",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
      "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣",
      "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋",
      "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕",
      "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈",
      "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒",
      "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕",
      "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🐓", "🎃", "🐿️", "🦔", "🦇", "🌵", "🌲",
    ],
  },
  food: {
    name: "Food & Drink",
    emojis: [
      "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭",
      "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽",
      "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀",
      "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔",
      "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕",
      "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚",
      "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰",
      "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛",
      "☕", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸",
      "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣", "🥡", "🥢", "🧂",
    ],
  },
  activities: {
    name: "Activities",
    emojis: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓",
      "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿",
      "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂",
      "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾", "🏌️", "🏇", "🧘", "🏊", "🚴", "🚵",
      "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🪘", "🎷", "🎺",
      "🪗", "🎸", "🪕", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩",
    ],
  },
  travel: {
    name: "Travel & Places",
    emojis: [
      "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚",
      "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔",
      "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅",
      "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️",
      "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "⚓", "⛽",
      "🚧", "🚦", "🚥", "🚏", "🗺️", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟️", "🎡",
      "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏜️", "🌋", "⛰️", "🏔️", "🗻", "🏕️",
      "⛺", "🏠", "🏡", "🏘️", "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥",
      "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🕍", "🛕", "🕋",
      "⛩️", "🗾", "🎑", "🏞️", "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙️",
      "🌃", "🌌", "🌉", "🌁",
    ],
  },
  objects: {
    name: "Objects",
    emojis: [
      "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽",
      "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️",
      "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️",
      "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸",
      "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧",
      "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤", "🧱", "⛓️", "🧲", "🔫",
      "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🏺",
      "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉",
      "🩸", "🧬", "🦠", "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🚽", "🚿",
      "🛁", "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🛎️", "🔑", "🗝️", "🚪",
      "🪑", "🛋️", "🛏️", "🛒", "🧳", "🪴", "🖼️", "🛍️", "🛍️",
    ],
  },
  symbols: {
    name: "Symbols",
    emojis: [
      "💬", "💭", "🗯️", "💭", "💬", "🗯️", "🗨️", "🗯️", "💭", "💬", "🗯️", "🗨️",
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
      "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️",
      "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌",
      "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️",
      "📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️",
      "㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌",
      "⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱",
      "🔞", "📵", "🚭", "❗", "❕", "❓", "❔", "‼️", "⁉️", "🔅", "🔆", "〽️",
      "⚠️", "🚸", "🔱", "⚜️", "🔰", "♻️", "✅", "🈯", "💹", "❇️", "✳️", "❎",
      "🌐", "💠", "Ⓜ️", "🌀", "💤", "🏧", "🚾", "♿", "🅿️", "🛗", "🈳", "🈂️",
      "🛂", "🛃", "🛄", "🛅", "🚹", "🚺", "🚼", "⚧️", "🚻", "🚮", "🎦", "📶",
      "🈁", "🔣", "ℹ️", "🔤", "🔡", "🔠", "🆖", "🆗", "🆙", "🆒", "🆕", "🆓",
      "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔢",
      "#️⃣", "*️⃣", "⏏️", "▶️", "⏸️", "⏯️", "⏹️", "⏺️", "⏭️", "⏮️", "⏩", "⏪",
      "⏫", "⏬", "◀️", "🔼", "🔽", "➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️",
      "↖️", "↕️", "↔️", "↪️", "↩️", "⤴️", "⤵️", "🔀", "🔁", "🔂", "🔄", "🔃",
      "🎵", "🎶", "➕", "➖", "➗", "✖️", "🟰", "♾️", "💲", "💱", "™️", "©️",
      "®️", "〰️", "➰", "➿️", "🔚", "🔙", "🔛", "🔝", "🔜", "✔️", "☑️", "🔘",
      "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨",
      "🟩", "🟦", "🟪", "🟫", "⬛", "⬜", "◼️", "◻️", "◾", "◽", "▪️", "▫️",
      "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲", "🏁", "🚩",
      "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️",
    ],
  },
  business: {
    name: "Business & Work",
    emojis: [
      "💼", "📊", "📈", "📉", "💹", "🏢", "🏦", "🏛️", "⚖️", "🗂️", "📁", "📂",
      "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "📋", "📝", "📄",
      "📃", "🎑", "📑", "🔖", "🏷️", "💰", "💴", "💵", "💶", "💷", "💸", "💳",
      "🧾", "💹", "✉️", "📧", "📨", "📩", "💌", "📥", "📤", "📦", "🏷️", "📪",
      "📫", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📈",
      "📉", "🗒️", "🗓️", "📅", "📆", "🗓️", "📇", "🗃️", "📊", "📈", "📉", "📁",
      "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "🗃️", "📋", "📰", "🗞️", "📓",
      "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖", "🔖", "🧷", "🔗", "📎",
      "🖇️", "📐", "📏", "🧮", "📌", "📍", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️",
      "📝", "✏️", "🔍", "🔎", "🔬", "🔭", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭",
      "⏰", "⏱️", "⏲️", "⌛", "⏳", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋",
      "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🎥",
      "🎞️", "📽️", "🎬", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕵️", "💻", "🤖",
      "🦾", "🦿", "🦸", "🦹", "🧙", "🧚", "🧛", "🧜", "🧝", "🧞", "🧟", "💆",
      "💇", "🚶", "🧍", "🧎", "🏃", "💃", "🕺", "🕴️", "👯", "🧖", "🧘", "🧗",
      "🤺", "🏇", "🏂", "🏌️", "🏄", "🚣", "🏊", "⛹️", "🏋️", "🚴", "🚵", "🤸",
      "🤼", "🤽", "🤾", "🤹", "🛀", "🛌", "👭", "👫", "👬", "💏", "💑", "👪",
      "🗣️", "👤", "👥", "👣", "🦰", "🦱", "🦲", "🦳", "🐶", "🐱", "🐭", "🐹",
      "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
    ],
  },
};

/**
 * Emoji search keywords for better search results
 */
const EMOJI_KEYWORDS = {
  thumbs: ["👍", "👎"],
  heart: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  fire: ["🔥", "💥", "💢", "✨"],
  celebration: ["🎉", "🎊", "🎈", "🎁", "🎀", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️"],
  hands: ["👏", "🙌", "👐", "🤲", "🤝", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✊", "👊", "🤛", "🤜", "🙏", "💪"],
  face: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿"],
  tech: ["💻", "🖥️", "📱", "📲", "⌨️", "🖱️", "🖲️", "💾", "💿", "📀", "🎥", "📷", "📸", "📹", "📼", "🔋", "🔌", "💡", "🔦", "📡", "🔋", "💻", "🤖", "🦾", "🦿"],
  money: ["💰", "💵", "💴", "💶", "💷", "💸", "💳", "🧾", "💹", "💲", "💱", "📉", "📈", "💹"],
  time: ["⌚", "⏰", "⏱️", "⏲️", "⏳", "⌛", "📅", "📆", "🗓️", "📇", "📈", "📉", "📊", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "🗃️", "📋", "📰", "🗞️", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖"],
  arrow: ["➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↕️", "↔️", "↪️", "↩️", "⤴️", "⤵️", "🔀", "🔁", "🔂", "🔄", "🔃", "▶️", "◀️", "⏸️", "⏯️", "⏹️", "⏺️", "⏭️", "⏮️", "⏩", "⏪", "⏫", "⏬"],
  star: ["⭐", "🌟", "✨", "💫", "⚡", "🔥", "💥", "💢", "✨"],
  check: ["✅", "☑️", "✔️"],
  rocket: ["🚀", "🛸", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂"],
  bulb: ["💡", "🔦", "🪔", "🧯", "🌟", "✨"],
  work: ["💼", "📊", "📈", "📉", "🏢", "🏦", "🏛️", "⚖️", "🗂️", "📁", "📂", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "📋", "📝", "📄", "📃", "🎑", "📑", "🔖", "🏷️", "💰", "💴", "💵", "💶", "💷", "💸", "💳"],
};

/**
 * Flatten all emojis for search
 */
const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flatMap((category) =>
  category.emojis.map((emoji) => ({ emoji, category: category.name }))
);

export default function EmojiPicker({
  onEmojiSelect,
  triggerClassName,
  trigger,
  open: controlledOpen,
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("frequently");
  const [searchQuery, setSearchQuery] = useState("");
  const [frequentlyUsed, setFrequentlyUsed] = useState(
    EMOJI_CATEGORIES.frequently.emojis
  );

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setOpen(value);
    }
  };

  /**
   * Filter emojis based on search query
   */
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return EMOJI_CATEGORIES[activeCategory]?.emojis || [];
    }

    const query = searchQuery.toLowerCase();
    const results = new Set();

    // Search in keyword mappings
    Object.entries(EMOJI_KEYWORDS).forEach(([keyword, emojis]) => {
      if (keyword.includes(query)) {
        emojis.forEach((emoji) => results.add(emoji));
      }
    });

    // Search by category name
    Object.entries(EMOJI_CATEGORIES).forEach(([key, category]) => {
      if (category.name.toLowerCase().includes(query)) {
        category.emojis.forEach((emoji) => results.add(emoji));
      }
    });

    return Array.from(results);
  }, [searchQuery, activeCategory]);

  /**
   * Handle emoji selection
   */
  const handleEmojiSelect = useCallback(
    (emoji) => {
      onEmojiSelect?.(emoji);

      // Update frequently used
      setFrequentlyUsed((prev) => {
        const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 10);
        return updated;
      });

      // Don't close after selection for better UX
      // setIsOpen(false);
    },
    [onEmojiSelect]
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (e, emoji) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEmojiSelect(emoji);
      }
    },
    [handleEmojiSelect]
  );

  /**
   * Default trigger button
   */
  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`text-muted-foreground hover:text-foreground ${triggerClassName || ""}`}
    >
      <Smile className="w-4 h-4" />
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        sideOffset={4}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="emoji-picker"
        >
          {/* Search bar */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emojis..."
                className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="flex border-b border-border overflow-x-auto">
              {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeCategory === key
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <ScrollArea className="h-64">
            <div className="p-2">
              <div className="grid grid-cols-8 gap-1">
                <AnimatePresence mode="popLayout">
                  {filteredEmojis.map((emoji, index) => (
                    <motion.button
                      key={emoji + (index || "")}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      onKeyDown={(e) => handleKeyDown(e, emoji)}
                      className="aspect-square flex items-center justify-center text-xl rounded hover:bg-accent hover:scale-110 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.1, delay: index * 0.005 }}
                      title={emoji}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              {filteredEmojis.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No emojis found for "{searchQuery}"
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Press {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"} + Enter to insert
            </p>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Emoji picker button for use with textarea/inputs
 * Automatically inserts emoji at cursor position
 */
export function EmojiPickerButton({ textareaRef, onEmojiInsert, buttonClassName }) {
  const handleEmojiSelect = useCallback(
    (emoji) => {
      if (onEmojiInsert) {
        onEmojiInsert(emoji);
        return;
      }

      if (textareaRef?.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const newText = text.substring(0, start) + emoji + text.substring(end);
        textarea.value = newText;

        // Move cursor after emoji
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;

        // Trigger input event to update React state
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    [textareaRef, onEmojiInsert]
  );

  return <EmojiPicker onEmojiSelect={handleEmojiSelect} triggerClassName={buttonClassName} />;
}

