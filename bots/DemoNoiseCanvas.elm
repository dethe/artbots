import Html exposing (Html)
import Html.App as App
import AnimationFrame exposing (times, diffs)
import Time exposing (Time)
import Collage exposing (..)
import Color exposing (Color)
import Element exposing (toHtml)
import Array
import Noise exposing (PermutationTable, permutationTable, noise3d)
import Random exposing (initialSeed)

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

type alias Point = {x: Float, y: Float}

type alias Model = {
    points: List Point,
    time: Time,
    simplex: PermutationTable
}

init : (Model, Cmd Msg)
init =
  let
    (perm, newSeed) = permutationTable (initialSeed 42)
  in
  ({
    points = List.map (\n -> Point (toFloat (n%32 - 16)) (toFloat (n // 32 - 16))) [0..767],
    time = 0,
    simplex = perm
  },
  Cmd.none)


-- UPDATE

type Msg
  = Tick Time


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Tick newTime ->
      ({model | time = newTime}, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  times Tick

-- VIEW

-- Because simplex returns a number between -1 and 1, we need between 0 and 1
clampedNoise simplex time pt =
    ((noise3d simplex (pt.x / 15.0) (pt.y / 15.0) (time / 2000.0)) + 1.0) / 2.0

drawCircle simplex time pt =
    circle 10.0
    |> filled Color.red
    |> alpha (clampedNoise simplex time pt)
    |> move (pt.x * 20 + 10, pt.y * 20 + 10)

view : Model -> Html Msg
view model =
    toHtml (collage 640 480 (List.map (drawCircle model.simplex model.time) model.points))
