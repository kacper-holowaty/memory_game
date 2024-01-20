function FinishScreen() {
  // implementacja logiki:
  // odczytywanie czasu przez mqtt
  // zerowanie licznika przez mqtt
  // odczytywanie username z cookie
  // wywołanie axios logout (aby usunąć cookie oraz komentarze)
  // ustawienie size na null (dispatch)
  // dwa przyciski (play again) oraz (leaderboard)
  return (
    <div>
      <h2>Gratulacje udało ci się ukończyć grę!</h2>
    </div>
  );
}

export default FinishScreen;
