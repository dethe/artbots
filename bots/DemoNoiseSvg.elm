import Html exposing (Html)
import Html.App as App
import AnimationFrame exposing (times, diffs)
import Time exposing (Time)
import Color exposing (Color)
import Svg exposing (svg, circle)
import Svg.Attributes exposing (..)
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

type alias Model = Time

(simplex, newSeed) = permutationTable (initialSeed 42)
points = List.map (\n -> Point (toFloat (n%32 - 16)) (toFloat (n // 32 - 16))) [0..767]


init : (Model, Cmd Msg)
init =
  (0,
  Cmd.none)


-- UPDATE

type Msg
  = Tick Time


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Tick newTime ->
      (newTime, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  times Tick

-- VIEW

-- Because simplex returns a number between -1 and 1, we need between 0 and 1
clampedNoise time pt =
    ((noise3d simplex (pt.x / 15.0) (pt.y / 15.0) (time / 2000.0)) + 1.0) / 2.0

colorw flt =
    --- convert a number between 0 and 1 into an integer from 0 to 360
    toString (round (flt * 360))

drawCircle time pt =
    let
        z = clampedNoise time pt
        zs = toString z
    in
        circle [
            cx (toString (pt.x * 20 + 10)),
            cy (toString (pt.y * 20 + 10)),
            r (toString (10)),
            -- fill ("hsl(" ++ colorw(z) ++ ",50%,50%)")
            fill "#F00",
            opacity zs
        ] []

view : Model -> Html Msg
view time =
    svg
      [ width "640", height "480", viewBox "-320 -240 640 480" ]
      (List.map (drawCircle time) points)
