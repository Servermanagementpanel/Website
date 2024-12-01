function calculatePrice() {
    const basePricePerCore = 0.65;
    const basePricePerRam = 0.47;
    const basePricePerSSD = 0.35;
    const basePrice = 1.50;

    const cpuCores = parseInt(document.getElementById('cpuRange').value);
    const ram = parseInt(document.getElementById('ramRange').value);
    const ssd = parseInt(document.getElementById('ssdRange').value);

    const cpuPrice = (cpuCores - 1) * basePricePerCore;
    const ramPrice = (ram - 1) * basePricePerRam;
    const ssdPrice = ((ssd - 25) / 25) * basePricePerSSD;

    const totalPrice = basePrice + cpuPrice + ramPrice + ssdPrice;
    const discountedPrice = totalPrice * 0.5; // 50% Rabatt
    
    document.getElementById('originalPrice').textContent = totalPrice.toFixed(2);
    document.getElementById('totalPrice').textContent = discountedPrice.toFixed(2);
    document.getElementById('cpuPrice').textContent = cpuPrice.toFixed(2);
    document.getElementById('ramPrice').textContent = ramPrice.toFixed(2);
    document.getElementById('ssdPrice').textContent = ssdPrice.toFixed(2);
    document.getElementById('cpuValue').textContent = cpuCores + (cpuCores === 1 ? ' Core' : ' Cores');
    document.getElementById('ramValue').textContent = ram + ' GB';
    document.getElementById('ssdValue').textContent = ssd + ' GB';
}

document.getElementById('cpuRange').addEventListener('input', calculatePrice);
document.getElementById('ramRange').addEventListener('input', calculatePrice);
document.getElementById('ssdRange').addEventListener('input', calculatePrice);