document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
          e.preventDefault();
          if (deskOverlay && deskOverlay.style.display === 'block') {
            window.closeDesk();
          } else {
            window.openDesk();
          }
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
          e.preventDefault();
          alert("Dear Dhruv,\n\nI built this place because I wanted to preserve the parts of you that sometimes go unnoticed.\n\nNot only your achievements.\nNot only your goals.\n\nBut your questions. Your silence. Your small thoughts.\n\nThe world will celebrate what you create. I hope you always remember that someone admires who you are while creating it.\n\n— P");
        }
      });